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

app.get('/', function(req, res){
			var partido = 0;
			getMaxValue('idPartido', 'Partido', function(recordset){
				console.log(recordset);
			partido = recordset[0].id;
			console.log(partido);
	});
			res.end();
});

//Devuelve el nombre y apellido paterno de una persona con un codigo
app.get('/persona', function(req, res){
	getPersona(req.query.code ,function(recordset){
		console.log(recordset);
		res.send(recordset);
	});
});

//Obetener todos los equipos
app.get('/equipo', function(req, res){
	getEquipo(function(recordset){
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
		for(var i = 0; i<recordset.length ; i=i+2)
		{

			response.push(recordset[i]);
		//	console.log(response);
			response[j].Equipo2 = recordset[i+1].Equipo1; 
			j++;
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
		res.send(recordset);
	});
});

//Obtiene todas disciplinas
app.get('/disciplina', function(req, res){
	getDisciplinas(function(recordset){
		console.log(recordset);
	});
});

//Obtiene todas disciplinas
app.get('/disciplina/nombre', function(req, res){
	getDisciplina(function(recordset){
		console.log(recordset);
	});
});

//Insertar persona
//app.post('/persona', function(req, res){
//	insertPersona(req.body, function(recordset){
//		console.log(recordset);
//	});
//});

//
app.post('/equipo', function(req, res){
	insertEquipo(req.body, function(recordset){
		console.log(recordset);
	});
});

app.post('/evento', function(req, res){
	insertEvento(req.body, function(recordset){
		console.log(recordset);
	});
});

app.get('/hora', function(req, res){
	insertHora(req.body, function(recordset){
		console.log(recordset);
	});
});

app.post('/partido', function(req, res){
	var idPartido = 0;

	insertPartido(req.body, function(recordset){
		console.log(recordset);
	});



	getMaxValue('idPartido', 'Partido', function(recordset){
		idPartido = recordset[0].id;
	});

	insertEquipoPartido(idPartido,req.body, function(recordset){
		console.log(recordset);
	});

});

app.post('/disciplina', function(req, res){
	insertDisciplina(req.body, function(recordset){
		console.log(recordset);
	});
});

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
			request.query("Select nombre,apellidopaterno,apellidomaterno from Persona where Persona.Codigo =" + codigo, function(err, recordset){
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
			request.query("Select Equipo.Nombre from Equipo where Equipo.nombre like '%"+nombre+"%'" , function(err, recordset){
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
			request.query("Select * from Evento", function(err, recordset){
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
			request.query("Select * from Evento where Evento.idDisciplina = (select Disciplina.idDisciplina from Disciplina where Disciplina.nombre like '%" +disciplina+ "%')", function(err, recordset){
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
			request.query("Select * from Evento where evento.nombre like '%"+nombre+"%'", function(err, recordset){
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
			request.query("SELECT Equipo.Nombre as Equipo1, Hora.HoraInicio, Partido.Fecha" +
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
			request.query("Select * from "+
							"(Select t1.Nombre as Equipo1, t1.HoraInicio, t1.Fecha, t2.Nombre as Equipo2 "+
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
			request.query("Insert into Persona values(" + persona.nombre+","+ persona.ci+","+persona.celular+","+persona.email+","+persona.telefono+","+persona.habilitado+");", function(err, recordset){
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

function insertEquipo(equipo, callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Equipo values("+equipo.nombre+","+equipo.anio+","+equipo.idEvento+");" , function(err, recordset){
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
			request.query("Insert into Equipo values("+evento.nombre+","+evento.descripcion+","+evento.fechainicio+","+evento.fechafin+","+evento.lugar+","+evento.horainicio+","+evento.disciplina+");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creado Evento' + evento.nombre);
    			}
			});
		}
	});
};

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
			request.query("Insert into Hora values("+hora.horainicio+","+hora.horafin+");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creado Horario ' + hora.horainicio + " - " + hora.horafin);
    			}
			});
		}
	});
};

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
			request.query("Insert into Disciplina values("+disciplina.nombre+","+disciplina.maxInscripciones+");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creada disciplina ' + disciplina.nombre);
    			}
			});
		}
	});
};

function insertHistorial(historial, callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Disciplina values("+historial.codigo+","+historial.descripcion+");" , function(err, recordset){
				callback(recordset);
				if (err) {
       				console.log(err);
    			} else {
        			console.log('Creado el historial');
    			}
			});
		}
	});
};

function insertPartido(partido, callback)
{
	
	var connection = new sql.Connection(config, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			var request = new sql.Request(connection);
			request.query("Insert into Partido values("+partido.fecha+","+partido.idhorario+");" , function(err, recordset){
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

function insertEquipoPartido(idPartido, partido, callback)
{
	var i;
	for(i = 0 ; i < partido.equipos.length ; i++){
		var connection = new sql.Connection(config, function(err){
			if(err)
			{
				console.log(err);
			}
			else
			{
				var request = new sql.Request(connection);
				request.query("Insert into EquipoPartido values("+idPartido+","+partido.equipos[i]+", 0);" , function(err, recordset){
					callback(recordset);
					if (err) {
	       				console.log(err);
	    			} else {
	        			console.log('Sin error');
	    			}
				});
			}
		});
	}
};

/*
{
	idPartido:algo
	fecha:algo
	equipos: [
				1,2,3,4...n
				]
}
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FIN DE LOS METODOS DE INSERCION EN LA ABSE DE DATOS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////