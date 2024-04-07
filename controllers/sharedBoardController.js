const { SharedBoard } = require('../config/database');
const { Op } = require('sequelize');

exports.addSharedBoard = async (req, res) => {
    try {
        const { userId } = req;
        const { users, name } = req.body;
        const newBoard = await SharedBoard.create({
            users: users,
            name: name,
            userId,
        });
        return res.status(200).json({ message: "Tablero compartido creado correctamente" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSharedBoards = async (req, res) => {
    try {
        const { userId } = req;
        const { page = 1, limit = 10 } = req.query; // Establecer valores predeterminados para la página y el límite
        const offset = (page - 1) * limit; // Calcular el desplazamiento basado en la página y el límite

        const boards = await SharedBoard.findAndCountAll({
            where: {
                userId,
                deleted_at: { [Op.is]: null }
            },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: boards.count,
            boards: boards.rows
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};