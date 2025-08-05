
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";


export const getRecommendedUsers = async(req,res)=>{

    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and:[
                {_id : {$ne: currentUserId}},//Exclude Current user
                {_id:{$nin: currentUser.friends}}, //exclude current USER'S friend
                {isOnboarded: true}
            ]
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("Error in getRecommendedUsers Controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getMyFriends = async(req,res)=>{

    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePics nativeLanguage learningLanguage location");

        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getMyFriends controller", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
};

export const sendFriendRequest = async(req,res)=>{

    try {
        const myId = req.user.id;
        const { id:recipientId } = req.params;

        //prevent sending request to myself
        if( myId === recipientId) return res.status(400).json({message:"You can't send friend Request to yourself!!"});


        const recipient = await User.findById(recipientId);
        if(!recipient) return res.status(400).json({message: "recipient Not found"});

        //check if user is already friend
        if(recipient.friends.includes(myId)) return res.status(400).json({message:"You are Already friends with this User"});

        //check if req is already exists
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender: myId, recipient:recipientId},
                {sender: recipientId, recipient: myId},
            ],
        });

        if(existingRequest){
            return res.status(400).json({message:"A Friend request already exists between you and this user"})
        }

        //creating request
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        });
        res.status(200).json(friendRequest);
    } catch (error) {
        console.log("Error in sendFriendRequest Controller", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
};

export const acceptFriendRequest = async(req,res)=>{

    try {
        const { id:requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(400).json({ message : "Friend request not found"});
        }

        //Verify Current user is recipient
         if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message : "You are not authorised to accept this request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        //Each USER TO other;s friend Array
        //addtoset: adds Element to an array only if they do not already Exists.
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends: friendRequest.recipient}
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: {friends : friendRequest.sender}
        });

        
        res.status(200).json({message:"Friend Request accepted"});
    } catch (error) {
        console.log("Error in acceptFriendRequest controller ",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getFriendRequests = async (req, res) => {
  const userId = req.user._id;

  try {
    const requests = await FriendRequest.find({ recipient: userId, status: "pending" })
      .populate("sender", "fullName profilePics nativeLanguage learningLanguage location") // ✅ only populate required fields
      .exec();

    res.status(200).json({ incomingReqs: requests });
  } catch (err) {
    res.status(500).json({ message: "Error fetching friend requests" });
  }
};


export const getOutgoingFriendsReqs = async(req,res)=>{
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status:"pending"
        }).populate("recipient", "fullName profilePics nativeLanguage learningLanguage location");
        res.status(200).json(outgoingRequests);
    } catch (error) {
          console.log("Error in getOutgoingFriendsReqs Controller ",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
};