const mongoose  = require('mongoose')
const bcrypt    = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim : true,
        minLength: 2,
        maxLength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim : true,
        maxLength: 255,
        lowercase: true,
        match : [/^\S+@\S+\.\S+$/, 'please fill a valid email address']
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    refreshToken: {
      type: String
    },

    role:{
        type: String,
        enum :['admin', 'editor','user'],
        default: 'user'
    },
    isVarified:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

UserSchema.pre('save', async function(){
    if(!this.isModified('password')){
      return 
    }
    this.password = await bcrypt.hash(this.password, 12);
  
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", UserSchema);
