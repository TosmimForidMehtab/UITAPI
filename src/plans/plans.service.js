import dayjs from 'dayjs';
import { Plan } from './plans.model.js';
import { Auth } from '../auth/auth.model.js';

export const isPlanExpired = async (planId, userId) => {
    if(!planId || !userId) {
        return null;
    }
    const plan = await Plan.findById(planId);
    if (!plan) {
        return null;
    }

    const user = await Auth.findById(userId);
    if (!user) {
       return null;
    }

    const currentDate = dayjs();
    const expiryDate = user?.planExpiry ? dayjs(user.planExpiry) : null;

    if (expiryDate && expiryDate.isBefore(currentDate)) {
        user.activePlan = null;
        user.planExpiry = null;
        await user.save();
        return true; // Plan is expired
    }

    return false;
};
