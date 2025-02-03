import schedule from 'node-schedule';
import logger from '../utils/logger';
import UserSubscriptionService from '../api/userSubscriptions/userSubscriptions.service';
import PaymentService from '../api/payments/payments.service';
import { PaymentStatus, SubscriptionStatus } from '../types/enums';
import SubscriptionRenewalLockService from '../api/subscriptionRenewalLocks/subscriptionRenewalLocks.service';

class SchedulerService {
    private static instance: SchedulerService;
    private lockService: SubscriptionRenewalLockService;
    
    private constructor() {
        this.lockService = new SubscriptionRenewalLockService();
        this.initializeScheduler();
    }

    public static getInstance(): SchedulerService {
        if (!SchedulerService.instance) {
            SchedulerService.instance = new SchedulerService();
        }
        return SchedulerService.instance;
    }

    private initializeScheduler() {
        // Schedule job to run at 4 PM UAE time (12:00 UTC)
        schedule.scheduleJob('0 0 16 * * *', async () => {
            try {
                logger.info('Starting scheduled subscription renewal');
                await this.renewSubscriptions();
                logger.info('Completed scheduled subscription renewal');
            } catch (error) {
                logger.error('Error in scheduled subscription renewal:', error);
            }
        });

        // Schedule job to process subscription cancellations at 4:30 PM UAE time (12:30 UTC)
        schedule.scheduleJob('0 30 16 * * *', async () => {
            try {
                logger.info('Starting scheduled subscription cancellation check');
                await this.processCancellations();
                logger.info('Completed scheduled subscription cancellation check');
            } catch (error) {
                logger.error('Error in scheduled subscription cancellation:', error);
            }
        });
    }

    private async renewSubscriptions() {
        try {
            // Get all active subscriptions that need renewal
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Try to acquire lock
            const lock = await this.lockService.acquireLock(today);
            if (!lock) {
                logger.info('Another server is already processing renewals for today');
                return;
            }
            
            try {
                const subscriptionsToRenew = await UserSubscriptionService.getSubscriptionsForRenewal(today);
                
                const results = {
                    successful: 0,
                    failed: 0,
                    errors: [] as string[]
                };

                for (const subscription of subscriptionsToRenew) {
                    try {
                        // Process payment for renewal
                        const payment = await PaymentService.processRenewalPayment(subscription);
                        
                        if (payment.status === PaymentStatus.SUCCESS) {
                            // Calculate new dates
                            const endDate = new Date();
                            endDate.setDate(endDate.getDate() + subscription.package.duration);
                            
                            // Update subscription
                            await UserSubscriptionService.updateSubscriptionStatus(subscription.id, SubscriptionStatus.Active);
                            
                            results.successful++;
                        } else {
                            // Handle failed payment
                            await UserSubscriptionService.updateSubscriptionStatus(
                                subscription.id,
                                SubscriptionStatus.PendingPayment
                            );
                            
                            // Increment retry count
                            await UserSubscriptionService.incrementFailedRetryCount(subscription.id);
                            
                            results.failed++;
                            results.errors.push(`Payment failed for subscription ${subscription.id}`);
                        }
                    } catch (error) {
                        results.failed++;
                        results.errors.push(`Error processing subscription ${subscription.id}: ${error}`);
                    }
                }

                logger.info('Subscription renewal results:', results);
                return results;
            } finally {
                // Always release the lock when done
                await this.lockService.releaseLock(lock);
            }
        } catch (error) {
            logger.error('Error processing subscription renewals:', error);
            throw error;
        }
    }

    private async processCancellations() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const subscriptionsToCancel = await UserSubscriptionService.getSubscriptionsForCancellation(today);
            
            const results = {
                successful: 0,
                failed: 0,
                errors: [] as string[]
            };

            for (const subscription of subscriptionsToCancel) {
                try {
                    await UserSubscriptionService.updateSubscriptionStatus(
                        subscription.id,
                        SubscriptionStatus.Cancelled
                    );
                    results.successful++;
                } catch (error) {
                    results.failed++;
                    results.errors.push(`Error cancelling subscription ${subscription.id}: ${error}`);
                }
            }

            logger.info('Subscription cancellation results:', results);
            return results;
        } catch (error) {
            logger.error('Error processing subscription cancellations:', error);
            throw error;
        }
    }
}

export default SchedulerService;
