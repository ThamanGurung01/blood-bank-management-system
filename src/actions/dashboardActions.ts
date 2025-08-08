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
    date: string;
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
    
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    const totalCount = await Blood.countDocuments({});
    
    const mongoose = require('mongoose');
    let queryId = bloodBankId;
    
   
    if (typeof bloodBankId === 'string' && mongoose.Types.ObjectId.isValid(bloodBankId)) {
      queryId = new mongoose.Types.ObjectId(bloodBankId);
    }
    
    const matchCriteria = {
      blood_bank: queryId,
      status: 'available'
    };
    
    const matchingSample = await Blood.find(matchCriteria).limit(2).lean();
    
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


    // Debug: Check if there's any blood data for this blood bank
    const totalBloodCount = await Blood.countDocuments({ blood_bank: bloodBankId });
    
    const availableBloodCount = await Blood.countDocuments({ 
      blood_bank: bloodBankId, 
      status: 'available' 
    });
    
    // Debug: Check sample blood records
    const sampleBloodRecords = await Blood.find({ blood_bank: bloodBankId }).limit(3);
    const bloodStockByType = await Blood.aggregate([
      {
        $match: {
          blood_bank:new mongoose.Types.ObjectId(bloodBankId),
          status: 'available',
        }
      },
      {
        $group: {
          _id: '$blood_type',
          units: { $sum: '$blood_units' }
        }
      },{
        $project:{
            _id:0,
            bloodType:'$_id',
            units:1
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

    await BloodDonation.countDocuments({ blood_bank: bloodBankId });
    await BloodDonation.find({ blood_bank: bloodBankId }).limit(2).lean();
     const recentDonations = await BloodDonation.find({
      blood_bank:bloodBankId
     }).sort({collected_date:-1}).limit(5)
    
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
            id:item._id.toString(),
            donorName:item.donor_name,
            bloodType:item.blood_type,
            units:item.blood_units,
            date:item.collected_date.toISOString()
        })) 
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard data' };
  }
};
