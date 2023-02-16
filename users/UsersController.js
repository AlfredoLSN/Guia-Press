const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const Category = require("../categories/Category");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/users", adminAuth,(req,res) => {
    User.findAll().then(users => {
        res.render("admin/users/index",{users:users});
    });
});
router.get("/admin/users/create",  (req,res) => {
    res.render("admin/users/create");
});

router.post("/users/create",  (req,res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
              email: email,
              password: hash,
            })
              .then(() => {
                res.redirect("/");
              })
              .catch((err) => {
                res.redirect("/");
              });
        }else{
            res.redirect("/admin/users/create")
        }
    })
});

router.post("/users/delete", adminAuth, (req,res) => {
    var id = req.body.id;
    if(id != undefined){
      if(!isNaN(id)){
        User.destroy({
          where: {id: id}
        }).then(() => {
          res.redirect("/admin/users");
        }).catch(err => {
          res.redirect("/admin/users");
        });

      }else{
        res.redirect("/admin/users");
      }
    }else{
      res.redirect("/admin/users");
    }
})
router.get("/admin/users/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
      res.redirect("/admin/users");
    }

    User.findByPk(id).then(user => {
      if(user != undefined){
        res.render("admin/users/edit",{user:user});
      }else{
        res.redirect("admin/users");
      } 
    }).catch(err => {
        res.redirect("/admin/users");
    })
})
router.post("/users/update", adminAuth, (req,res) => {
     var id = req.body.id;
     var email = req.body.email;
     var password = req.body.password;
     var oldEmail = req.body.oldEmail;
     User.findOne({where: {email:email}}).then(user => {
        if(user == undefined || user.email == oldEmail){
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(password, salt);
     
          User.update({email: email, password: hash},{
             where: {id: id}
          }).then(() => {
             res.redirect("/admin/users");
          }).catch(err => {
             res.redirect("/admin/users");
          })
        }else{
          res.redirect("/admin/users/edit/" + id);
        }
     })

     
})

router.get("/login", (req,res) => {
  res.render("admin/users/login");
});
router.post("/authenticate", (req,res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({where: {email: email}}).then(user => {
      if(user != undefined){
        // Validar senha
        var correct = bcrypt.compareSync(password, user.password);
        if(correct){
          req.session.user = {
            id: user.id,
            email: user.email
          }
          res.redirect("/admin/articles");
        }else{
          res.redirect("/login");
        }
      }else{
        res.redirect("/login");
      }
  })
})
router.get("/logout", (req,res) => {
  req.session.user = undefined;
  res.redirect("/");
})

module.exports = router;