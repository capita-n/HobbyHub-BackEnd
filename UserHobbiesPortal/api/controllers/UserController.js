/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Joi = require('joi')

module.exports = {
  

  /**
   * `UserController.login()`
   */
  login: async function (req, res) {
    try{
      const signupSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
      });
      //validate email and password
      const {email, password} = await Joi.validate(req.allParams(), signupSchema);
      const user = await User.findOne({email});
      if(!user){
        return res.notFound({err:"user does not exist"});
      }
      const matchedPassword = await UtilServices.comparePassword(password, user.password);
      if(!matchedPassword){
        res.badRequest({err:"unauthorized"})
      }
      const token = await JWTService.issuer({user:user.id}, '1 day');
      return res.ok({token});

    }
    catch(err){
      if(err.name ==='ValidationError'){
        return res.badRequest({err});
      }
      return res.serverError(err);    
    }
  },

  /**
   * `UserController.signUp()`
   */
  signUp: async function (req, res) {
    try{
      const signupSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
      });
      //validate email and password
      const {email, password} = await Joi.validate(req.allParams(), signupSchema);
      const encrypedPassword = await UtilServices.hashPassword(password);
      //Create a New user
      const user = await User.create({
        email,
        password: encrypedPassword
      });
      //send a new user in
      return res.ok(user);

    }
    catch(err){
      if(err.name ==='ValidationError'){
        return res.badRequest({err});
      }
      return res.serverError(err);    
    }
  }
   

};

