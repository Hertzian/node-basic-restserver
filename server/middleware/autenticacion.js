const jwt = require('jsonwebtoken');

// ------------
// verificar token
// ------------
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        // console.log(decoded)
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;

        next();

    });

}

// ------------
// verificar admin role
// ------------
let verificaAdminRole = (req, res, next) => {
    let admin = req.usuario;

    if(admin.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
};