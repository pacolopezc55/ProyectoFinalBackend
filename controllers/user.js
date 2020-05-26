'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

function saveUser(req, res){
	var user = new User();
	var params = req.body;
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	if (params.password){
		//Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(error, hash){
			user.password = hash;
			if (user.name != null && user.surname != null && user.email != null){
				//Guardar el usuario
				user.save((err, userStored) => {
					if (err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					} else{
						if (!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						} else {
							res.status(200).send({user: userStored});
						}
					}
				});
			}else{
				res.status(200).send({message: 'Rellena todos los campos'});

			}

		});

	}else{
		res.status(500).send({message: 'Introduce la contraseña'});
	}

}

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if (!user){
				res.status(404).send({message: ' El usuario no existe'});
			}else{
				//Comprobar la contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if (check){
						//devolver datos del usuario logueado

						if (params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido logearse'});
					}
				});
			}
		}
	});

}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err){
			  res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if (!userUpdated){
				 res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'Imagen no subida...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split= file_path.split('\\');
		var file_name = file_split[2];

		console.log(file_split);
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage

};