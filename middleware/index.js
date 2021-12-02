const restify = require('restify');

const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
	preflightMaxAge: 5,
	origins: ['*']
});

const server = restify.createServer({
	name: 'Prática 6'
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.pre(cors.preflight);
server.use(cors.actual);

const mysql = require('mysql');

const connectionUri = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'C216-L1'
};

function inserir(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('content-type','application/json');
	res.charSet('UTF-8');
	
	let aluno = {
		nome : req.body.nome,
		curso : req.body.curso,
		nascimento : req.body.nascimento
	};

	let connection = mysql.createConnection(connectionUri);
	let strQuery = `INSERT INTO aluno (nome, curso, nascimento) VALUES` +
	        	   `('${aluno.nome}', '${aluno.curso}', '${aluno.nascimento}');`
	console.log(strQuery);
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			res.json(rows);
		} else {
			res.json(err);
		}
	});
	connection.end();
};

function listar(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('content-type','application/json');
	res.charSet('UTF-8');
	let connection = mysql.createConnection(connectionUri);
	let strQuery = 'SELECT * FROM aluno;';
	console.log(strQuery);
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			res.json(rows);
		} else {
			res.json(err);
		}
	});
	connection.end();
};

function atualizar(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('content-type','application/json');
	res.charSet('UTF-8');

	let aluno = {
		id : req.body.id,
		nome : req.body.nome,
		curso : req.body.curso,
		nascimento : req.body.nascimento
	};

	let connection = mysql.createConnection(connectionUri);
	let strQuery = `UPDATE aluno SET ` + 
	                `nome = '${aluno.nome}', ` +
					`curso = '${aluno.curso}', ` +
					`nascimento = '${aluno.nascimento}' ` +
					`WHERE id = '${aluno.id}';`
	
	console.log(strQuery);
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			res.json(rows);
		} else {
			res.json(err);
		}
	});
	connection.end();
};

function excluir(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	//res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('content-type','application/json');
	res.charSet('UTF-8');

	let connection = mysql.createConnection(connectionUri);
	let strQuery = `DELETE FROM aluno WHERE id = '${req.body.id}';`
	
	console.log(strQuery);
	connection.query(strQuery, function(err, rows, fields) {
		if (!err) {
			res.json(rows);
		} else {
			res.json(err);
		}
	});
	connection.end();
};

const prefix = '/aluno';

server.post(prefix + '/inserir', inserir);
server.get(prefix + '/listar', listar);
server.put(prefix + '/atualizar', atualizar);
server.del(prefix + '/excluir', excluir);

const port = process.env.PORT || 5000;

server.listen(port, function() {
	console.log('%s rodando', server.name);
});