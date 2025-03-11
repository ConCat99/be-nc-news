exports.handleNotARoute = (req, res) => {
	res.status(404).send({ msg: 'Not Found' });
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Internal Server error!' });
};
