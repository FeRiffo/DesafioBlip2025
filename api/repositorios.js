require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_API_URL = "https://api.github.com/orgs/takenet/repos";

// Ruta para obtener los cinco repositorios más antiguos de C#
app.get("/repositorios", async (req, res) => {
    try {
        const response = await axios.get(GITHUB_API_URL, {
            headers: { Accept: "application/vnd.github.v3+json" }
        });

        // Filtrar solo los repositorios de C#
        const repositorios = response.data
            .filter(repo => repo.language === "C#")
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .slice(0, 5);

        const resultado = repositorios.map(repo => ({
            nome: repo.full_name,
            descricao: repo.description,
            avatar: repo.owner.avatar_url
        }));

        res.json(resultado);
    } catch (error) {
        console.error("Erro ao obter repositórios:", error);
        res.status(500).json({ erro: "Erro ao buscar repositórios do GitHub" });
    }
});

// Exporta la aplicación para Vercel
module.exports = app;
