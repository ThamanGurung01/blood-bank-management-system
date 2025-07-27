"use server";

import { connectToDb } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Blood from "@/models/blood.models";
import BloodRequest from "@/models/blood_request.models";
import { startOfDay, subDays, endOfDay } from "date-fns";

export interface DashboardStats {
  totalBloodUnits: number;
  totalDonations: number;
  pendingRequests: number;
  upcomingRequests: number;
  bloodStockByType: Array<{
    bloodType: string;
    units: number;
  }>;
  donationTrends: Array<{
    date: string;
    count: number;
  }>;
  recentDonations: Array<{
    id: string;
    donorName: string;
    bloodType: string;
    units: number;
    date: string; // Changed from Date to string for serialization
  }>;
}

export const getDashboardStats = async (): Promise<{
  success: boolean;
  data?: DashboardStats;
  error?: string;
}> => {
  try {
    await connectToDb();
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'blood_bank') {
      return { success: false, error: 'Unauthorized' };
    }

    const bloodBankId = session.user.id;
    
    // Get current date and date range for trends (last 7 days)
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    
    // 1. Get total blood units (only available units)
    const totalBloodUnits = await Blood.aggregate([
      {
        $match: {
          blood_bank: bloodBankId,
          status: 'available',
          expiry_date: { $gt: new Date() } // Only non-expired blood
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$blood_units' }
        }
      }
    ]);

    // 2. Get total donations count
    const totalDonations = await Blood.countDocuments({
      blood_bank: bloodBankId
    });

    // 3. Get pending blood requests
    const pendingRequests = await BloodRequest.countDocuments({
      blood_bank: bloodBankId,
      status: 'pending'
    });

    // 4. Get upcoming blood requests (next 7 days)
    const upcomingRequests = await BloodRequest.countDocuments({
      blood_bank: bloodBankId,
      required_date: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: 'approved'
    });

    // 5. Get blood stock by type
    const bloodStockByType = await Blood.aggregate([
      {
        $match: {
          blood_bank: bloodBankId,
          status: 'available',
          expiry_date: { $gt: new Date() }
        }
      },
      {
        $group: {
          _id: '$blood_type',
          units: { $sum: '$blood_units' }
        }
      },
      {
        $project: {
          bloodType: '$_id',
          units: 1,
          _id: 0
        }
      }
    ]);

    // 6. Get donation trends for last 7 days
    const donationTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const start = startOfDay(date);
      const end = endOfDay(date);
      
      const count = await Blood.countDocuments({
        blood_bank: bloodBankId,
        collected_date: { $gte: start, $lte: end }
      });
      
      donationTrends.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    // 7. Get recent donations (last 5)
    const recentDonations = await Blood.aggregate([
      {
        $match: {
          blood_bank: bloodBankId
        }
      },
      {
        $lookup: {
          from: 'donors',
          localField: 'donor',
          foreignField: '_id',
          as: 'donorInfo'
        }
      },
      { $unwind: '$donorInfo' },
      {
        $sort: { collected_date: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          id: { $toString: '$_id' },
          donorName: { $concat: ['$donorInfo.first_name', ' ', '$donorInfo.last_name'] },
          bloodType: 1,
          units: '$blood_units',
          date: { $dateToString: { date: '$collected_date', format: '%Y-%m-%dT%H:%M:%S.%LZ' } }
        }
      }
    ]);

    return {
      success: true,
      data: {
        totalBloodUnits: totalBloodUnits[0]?.total || 0,
        totalDonations,
        pendingRequests,
        upcomingRequests,
        bloodStockByType,
        donationTrends,
        recentDonations: recentDonations.map(donation => ({
          ...donation,
          id: donation.id.toString()
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard data' };
  }
};
