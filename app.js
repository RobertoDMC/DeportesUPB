//Importing express and body-parser
var express = require('express');
var bodyParser = require('body-parser');
var sql = require('mssql');
//var io = require('socket.io');
//Initializaing the app as an express app
var app = express();

//Setting listening port to 8080
var  port = 8080;

//Setting the body-parser to read URL body
app.use(bodyParser.json());		
app.use(bodyParser.urlencoded({ extended: false }));

//Setting the server and listening on port 8080
app.listen(port, function(err, res){
	if(err){
		console.log("Server Error");
	}
	else{
		console.log("Server listening on port: " + port);
	}
});

var config = {
		user: 'admin',
		password: 'admin',
		database:'UPBDeportes',
		server:'localhost'
	};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Metodos GETS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Devuelve el nombre y apellido paterno de una persona con un codigo
app.get('/persona', function(req, res){
	getPersona(req.query.codigo ,function(recordset){
		console.log(recordset);
		var json = {};
		json.persona = recordset;
		res.send(recordset[0]);
		//res.send(recordset);
	});
});

//Obetener todos los equipos
app.get('/equipo', function(req, res){
	getEquipo(function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Obetener todos los equipos de un anio
app.get('/equipo/actuales', function(req, res){
	getEquipoActuales(function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Obetener todos los equipos registrados a un evento especifico
app.get('/equipo/evento', function(req, res){
	getEquipoEvento(req.query.nombre, function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Obtener un equipo en particular
app.get('/equipo/nombre', function(req, res){
	getEquipoNombre(req.query.nombre,function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Devuelve todos los eventos
app.get('/evento', function(req, res){
	getEvento(function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Devuelve todos los eventos de una disciplina especifica
app.get('/evento/disciplina', function(req, res){
	getEventoDisciplina(req.query.disciplina,function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Devuelve el evento con un nombre especifico
app.get('/evento/nombre', function(req, res){
	getEventoNombre(req.query.nombre,function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//devuelve todos los horarios
app.get('/hora', function(req, res){
	getHora(function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Devolver los todos partidos
app.get('/partido', function(req, res){
	getPartido(function(recordset){
		//console.log(recordset);
		var response = [];	
		var j = 0;
		var i;
		for(i = 0; i<recordset.length ; i=i+2)
		{
			var json = {};
			json.idPartido = recordset[i].idPartido;
			json.equipo1 = recordset[i].equipo1;
			json.horaInicio = recordset[i].horaInicio;
			json.fecha = recordset[i].fecha;
			json.equipo2 = recordset[i+1].equipo1;
			json.puntaje = recordset[i].puntos + "-" + recordset[i+1].puntos;
			response.push(json);
		}
		console.log(response);
		res.send(response);
	});
});

//Obtiene un partido con un nombre especifico
app.get('/partido/nombre', function(req, res){
	//Request contiene dos nombres, uno de cada equipo
	getPartidoNombre(req.query.nombre1,req.query.nombre2,function(recordset){
		console.log(recordset);
		var json = {};
		json.partido = recordset;
		res.send(json);
		//res.send(recordset);

	});
});

//Obtiene todas disciplinas
app.get('/disciplina', function(req, res){
	getDisciplinas(function(recordset){
		console.log(recordset);
		var json = {};
		json.disciplina = recordset;
		res.send(json);
	});
});

//Obtiene todas disciplinas
app.get('/disciplina/nombre', function(req, res){
	getDisciplina(function(recordset){
		console.log(recordset);
		var json = {};
		json.disciplina = recordset;
		res.send(json);
	});
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIN DE GETS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//POSTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Insertar persona
//app.post('/persona', function(req, res){
//	insertPersona(req.body, function(recordset){
//		console.log(recordset);
//	});
//});

//Llega el id del evento(si Dios quiere, caso contrario el nombre en este caso estamos jodidos) al que se va a registrar
app.post('/equipo', function(req, res){
	var date = new Date();
	var idEquipo = 0;
	var idEvento = 0;
	insertEquipo(req.body,date.getFullYear(), function(recordset){
		//console.log(recordset);
		getMaxValue('idEquipo', 'Equipo', function(recordset){
			idEquipo = recordset[0].id;
			getEventoNombre(req.body.evento,function(recordset){
				console.log(recordset);
			idEvento = recordset[0].idEvento;
			console.log(idEquipo);
			console.log(idEvento);
				insertEventoEquipo(idEquipo, idEvento,function(recordset){

				});
			});

		});	
	});
	res.send("ok");
});	

app.post('/equipo/persona', function(req, res){
	getEquipoNombreExac(req.body.nombreEquipo, function(recordset){
		insertEquipoPersona(recordset[0].idEquipo, req.body.codigo, function(recordset){
		});
	});
	res.send("ok");
});

app.post('/evento', function(req, res){
	insertEvento(req.body);
	res.send("ok");
});

app.post('/hora', function(req, res){
	insertHora(req.body);
	res.send("ok");
});


app.post('/partido', function(req, res){
	var idPartido = 0;
	var equipo1Id = 0;
	var equipo2Id = 0;
	var idHorario = 0;

	getId('idHorario', 'Hora',"horaInicio", req.body.horaInicio,function(recordset){
		console.log(recordset);
		idHorario = recordset[0].idHorario;
		insertPartido(req.body,idHorario, function(recordset){
			//console.log(recordset);
			getMaxValue('idPartido', 'Partido', function(recordset){
				idPartido = recordset[0].id;
						getEquipoNombreExac(req.body.equipo1, function(recordset){
						equipo1Id = recordset[0].idEquipo;
						getEquipoNombreExac(req.body.equipo2, function(recordset){
						equipo2Id = recordset[0].idEquipo;
							console.log(idPartido);
							insertEquipoPartido(idPartido, equipo1Id, equipo2Id, function(recordset){
							});
						});
					});
			});
		});
	});

	res.send("ok");

});

app.post('/disciplina', function(req, res){
	insertDisciplina(req.body);
	res.send("ok");
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIN DE POSTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//METODOS PARA OBTENER DATOS DE LA BASE DE DATOS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Devolver el nombre y apellido paterno a partir de unn codigo
function getPersona(codigo, callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select codigo, nombre, apellidoPaterno, apellidoMaterno from Persona where Persona.Codigo =" + codigo, function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Datos enviados con exito');
    			}
			});
		}
	});
};

//Obtiene el maximo valor de la tabla
function getMaxValue(column, table_name, callback)
{
		var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select max("+ column +") as id from " + table_name, function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Obtiene el valor da la columna, en la table de acuerdo a un string
function getId(column, table, columnToSelect,value, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
				request.query("Select " + column + " from " + table + " where "+ columnToSelect + " = '" + value+"';", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para devolver todos los equipos
function getEquipo(callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select * from Equipo", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener los equipos actuales
function getEquipoActuales(callback )
{
	var date = new Date();
	var anio = date.getFullYear();
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select * from Equipo where anio =" + anio +";", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//FUncion para obtener los equipos registrados a un evento
function getEquipoEvento(nombre, callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("SELECT        Equipo.nombre " +
						  "FROM            Equipo INNER JOIN " +
                          "EventoEquipo ON Equipo.idEquipo = EventoEquipo.idEquipo INNER JOIN "+
                          "Evento ON EventoEquipo.idEvento = Evento.idEvento " +
						  "where Evento.nombre = '" + nombre + "';", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener un equipo de acuerdo a su nombre
function getEquipoNombre(nombre,callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select Equipo.idEquipo,Equipo.nombre from Equipo where Equipo.nombre like '%"+nombre+"%'" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener el id de un equipo de acuerdo a un nombre
function getEquipoNombreExac(nombre,callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select Equipo.idEquipo from Equipo where Equipo.nombre = '"+nombre+"'" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion que obtiene los eventos
function getEvento(callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select idEvento as id, nombre from Evento", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener los eventos de acuerdo a su disciplina
function getEventoDisciplina(disciplina, callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select idEvento, Nombre from Evento where Evento.idDisciplina = (select Disciplina.idDisciplina from Disciplina where Disciplina.nombre like '%" +disciplina+ "%')", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener un evento de acuerdo a su nombre
function getEventoNombre(nombre, callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select * from Evento where evento.nombre = '"+nombre+"'", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcoin para obtener todas las disciplinas
function getDisciplinas(callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select * from Disciplina", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener una disciplina en particular
function getDisciplina(disciplina, callback )
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select * from Disciplina where Nombre = " + disciplina, function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener todos los partidos
function getPartido(callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("SELECT distinct Partido.idPartido, Equipo.Nombre as equipo1, Hora.horaInicio, Partido.fecha, puntos" +
                           " FROM Equipo INNER JOIN"+
	                        " EquipoPartido ON Equipo.idEquipo = EquipoPartido.idEquipo INNER JOIN"+
                         	" Partido ON EquipoPartido.idPartido = Partido.idPartido INNER JOIN"+
                        	" Hora ON Partido.idHorario = Hora.idHorario", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion que devuelve un partido de acuerdo al nombre de los equipos que juegan el partido
function getPartidoNombre(equipo1, equipo2, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select distinct * from "+
							"(Select t1.idPartido, t1.Nombre as equipo1, t1.horaInicio, t1.fecha, t2.Nombre as equipo2 "+
							"from (Select * from "+
							"(SELECT nombre, EquipoPartido.idPartido ,  Row_Number() OVER(ORDER BY EquipoPartido.idPartido) AS RowNumber, Hora.HoraInicio, Partido.Fecha "+
							"FROM            Equipo INNER JOIN "+
                        	"EquipoPartido ON Equipo.idEquipo = EquipoPartido.idEquipo INNER JOIN "+
                        	"Partido ON EquipoPartido.idPartido = Partido.idPartido INNER JOIN "+
							"Hora ON Partido.idHorario = Hora.idHorario "+
							"where Equipo.idEquipo in( "+
							"select idEquipo from EquipoPartido where idPartido in "+
							"(select	  idPartido from Partido)) ) as tabla1 "+
							"where (ROWNUMBER % 2)<>0) as t1 "+
							"inner join "+
							"(Select * from "+
							"(SELECT nombre, EquipoPartido.idPartido ,  Row_Number() OVER(ORDER BY EquipoPartido.idPartido) AS RowNumber,  Hora.HoraInicio, Partido.Fecha "+     
							"FROM            Equipo INNER JOIN "+
                         	"EquipoPartido ON Equipo.idEquipo = EquipoPartido.idEquipo INNER JOIN "+
                         	"Partido ON EquipoPartido.idPartido = Partido.idPartido INNER JOIN " +
						 	"Hora ON Partido.idHorario = Hora.idHorario "+
							"where Equipo.idEquipo in( "+
							"select idEquipo from EquipoPartido where idPartido in " + 
							"(select	  idPartido from Partido)) ) as tabla2 "+
							"where (ROWNUMBER % 2)=0) as t2 "+
							"on t1.idPartido = t2.idPartido) as t3 "+
							"where t3.Equipo1 like '%"+ equipo1 +"%' and t3.Equipo2 like '%" + equipo2 +"%' or t3.Equipo1 like '%"+ equipo2 +"%' and t3.Equipo2 like '%"+ equipo1 +"%'", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion para obtener los horarios
function getHora(callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Select * from Hora", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIN DE LOS METODOS PARA OBTENER DATOS DE LA BD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//METODOS PARA LA INSERCION DE DATOS EN LA BD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function insertPersona(persona, callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Persona values('"+ persona.nombre+"',"+persona.apellidoPaterno+"',"+persona.apellidoMaterno+"',"+ persona.ci+","+persona.celular+",'"+persona.email+"',"+persona.telefono+");", function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Registrada ' + persona.nombre);
    			}
			});
		}
	});
};

//Funcion para insertar equipos
function insertEquipo(equipo, anio,callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Equipo values('"+ equipo.nombre +"',"+ anio +");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creado '+ equipo.nombre);
    			}
			});
		}
	});
};

//Funcion para registrar personas en los equipos
function insertEquipoPersona(idEquipo, codigo, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into PersonaEquipo values("+ codigo +","+ idEquipo +");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log("Registrado la persona con exito");
    			}
			});
		}
	});
};

//Funcion para registrar un evento
function insertEvento(evento, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Equipo values('"+evento.nombre+"','"+evento.descripcion+"','"+evento.fechainicio+"','"+evento.lugar+"',"+evento.disciplina+");" , function(err, recordset){
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creado Evento' + evento.nombre);
    			}
			});
		}
	});
};

//Funcion para insertar horas establecidas por la coordinacion deportiva
function insertHora(hora, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Hora values('"+hora.horainicio+"','"+hora.horafin+"'');" , function(err, recordset){
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creado Horario ' + hora.horainicio + " - " + hora.horafin);
    			}
			});
		}
	});
};

//Funcion para insertar disciplinas
function insertDisciplina(disciplina, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Disciplina values('"+disciplina.nombre+"'');" , function(err, recordset){
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creada disciplina ' + disciplina.nombre);
    			}
			});
		}
	});
};

//Funcion para insertar un partido
function insertPartido(partido, idHorario,callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Partido values('"+partido.fecha+"',"+idHorario+");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion q obtiene de equipoPartido si es que ya hay un partido con ese id; en ese caso no hacer nada
function insertEquipoPartido(idPartido, equipo1Id, equipo2Id, callback)
{
	var i;
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into EquipoPartido values ("+idPartido+","+equipo1Id+", 0),("+idPartido+","+equipo2Id+", 0);" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Sin error');
    			}
			});
		}
	});
};

//Funcion encargada de insertar en la tabla EventoEquipo los ids de los equipos rgistrados a sus respectivos eventos
function insertEventoEquipo(idEquipo, idEvento, callback)
{
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into EventoEquipo values("+ idEvento +","+ idEquipo +");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log("Creado el Equipo con exito");
    			}
			});
		}
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIN DE LOS METODOS DE INSERCION EN LA ABSE DE DATOS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////