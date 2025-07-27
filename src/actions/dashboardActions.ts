"use server";

import { connectToDb } from "@/utils/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Blood from "@/models/blood.models";
import BloodRequest from "@/models/blood_request.models";
import BloodDonation from "@/models/blood_donation.models";
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
    
    // Log the session user to verify the ID
    console.log('Session user:', JSON.stringify(session.user, null, 2));
    
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    
    console.log('Querying total blood units for blood bank ID:', bloodBankId);
    console.log('Blood bank ID type:', typeof bloodBankId);
    
        const totalCount = await Blood.countDocuments({});
    console.log('Total blood records in collection:', totalCount);
    
    const mongoose = require('mongoose');
    let queryId = bloodBankId;
    
   
    if (typeof bloodBankId === 'string' && mongoose.Types.ObjectId.isValid(bloodBankId)) {
      queryId = new mongoose.Types.ObjectId(bloodBankId);
      console.log('Converted blood bank ID to ObjectId');
    }
    
    const matchCriteria = {
      blood_bank: queryId,
      status: 'available'
    };
    
    console.log('Using match criteria:', JSON.stringify({
      ...matchCriteria,
      blood_bank: matchCriteria.blood_bank.toString()
    }, null, 2));
    
    const matchingSample = await Blood.find(matchCriteria).limit(2).lean();
    console.log('Sample matching records:', JSON.stringify(matchingSample, null, 2));
    
   const totalBloodUnits=await Blood.aggregate([
    {
        $match:matchCriteria
    },
    {
        $group:{
            _id:matchCriteria.blood_bank,
            total:{
                $sum:"$blood_units"
            }
        }
    }
])

    
   const totalDonations = await BloodDonation.countDocuments({
      blood_bank: bloodBankId
    });

    
    const pendingRequests = await BloodRequest.countDocuments({
      blood_bank: bloodBankId,
      status: 'pending'
    });

    
    const upcomingRequests = await BloodRequest.countDocuments({
      blood_bank: bloodBankId,
      required_date: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: 'approved'
    });


    const bloodStockByType = await Blood.aggregate([
      {
        $match: {
          blood_bank: bloodBankId,
          status: 'available',
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

    
    const donationTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const start = startOfDay(date);
      const end = endOfDay(date);
      
      const count = await BloodDonation.countDocuments({
        blood_bank: bloodBankId,
        collected_date: { $gte: start, $lte: end }
      });
      
      donationTrends.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

      
    console.log('Fetching recent donations for blood bank:', bloodBankId);
    
    const donationCount = await BloodDonation.countDocuments({ blood_bank: bloodBankId });
    console.log(`Found ${donationCount} blood donation records for blood bank ${bloodBankId}`);
    
    const sampleDonations = await BloodDonation.find({ blood_bank: bloodBankId }).limit(2).lean();
    console.log('Sample blood donation records:', JSON.stringify(sampleDonations, null, 2));
    


     const recentDonations = await BloodDonation.find({
      blood_bank:bloodBankId
     }).sort({collected_date:-1}).limit(5)

console.log("recentDonations",recentDonations);
      



    return {
      success: true,
      data: {
        totalBloodUnits: totalBloodUnits[0]?.total || 0,
        totalDonations, 
        pendingRequests,
        upcomingRequests,
        bloodStockByType,
        donationTrends,
        recentDonations:recentDonations.map((item:any)=>({
            id:item._id,
            donorName:item.donor_name,
            bloodType:item.blood_type,
            units:item.blood_units,
            date:item.collected_date
        })) 
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard data' };
  }
};
