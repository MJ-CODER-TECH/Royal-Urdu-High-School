const service=require("./result.service");



exports.create=async(req,res,next)=>{

try{


const data=
await service.createResult(
req.body
);



res.status(201).json({

success:true,

data

});


}
catch(error){

next(error);

}

};



exports.getAll=async(req,res,next)=>{


try{


const data=
await service.getAllResults();



res.json({

success:true,

data

});


}
catch(error){

next(error);

}


};




exports.getById=async(req,res,next)=>{


try{


const data=
await service.getResultById(
req.params.id
);



res.json({

success:true,

data

});


}
catch(error){

next(error);

}


};





exports.getByFilter=async(req,res,next)=>{


try{


const data=
await service.getResultsByFilter(
req.query
);



res.json({

success:true,

data

});


}
catch(error){

next(error);

}


};




exports.delete=async(req,res,next)=>{


try{


await service.deleteResult(
req.params.id
);



res.json({

success:true

});


}
catch(error){

next(error);

}


};



exports.generate=async(req,res,next)=>{


try{


const data =
await service.generateResult(
req.body
);



res.json({

success:true,

message:"Result Generated Successfully",

data

});


}
catch(error){

next(error);

}


};