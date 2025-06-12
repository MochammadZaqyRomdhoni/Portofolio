const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const NAMA_PRODUK = process.env.NAMA_PRODUK || "Akun CapCut Premium";
const HARGA = process.env.HARGA || 10000;

app.post("/webhook", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.chat || !msg.text) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await sendMessage(chatId, `Selamat datang! Ketik /beli untuk beli ${NAMA_PRODUK}.`);
  } else if (text === "/beli") {
    await sendMessage(chatId, `Silakan bayar Rp ${HARGA} ke QRIS berikut (dummy):\nhttps://dummyqris.link/qris.png\n\nKetik *Saya sudah bayar* jika sudah.`);
  } else if (text.toLowerCase().includes("sudah bayar")) {
    await sendMessage(chatId, `✅ Pembayaran diterima!\nBerikut akun CapCut kamu:\n\nEmail: dummycapcut@mail.com\nPassword: password123`);
  }

  res.sendStatus(200);
});

async function sendMessage(chatId, text) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot aktif di port ${PORT}`);
});
