import fs from 'fs';
import jwt from 'jsonwebtoken';

const cert_pub = fs.readFileSync(__dirname + '/ecdsa-p521-public.pem');
const cert_priv = fs.readFileSync(__dirname + '/ecdsa-p521-private.pem');

const token = jwt.sign({ foo: 'bar' }, cert_priv, { algorithm: 'ES512' });
console.log('token: ', token);
console.log(
  jwt.verify(
    'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNkIiwiaWF0IjoxNjE2MDgxMzY5LCJleHAiOjE2MTg2NzMzNjksImF1ZCI6Imh0dHA6Ly8xMjcuMC4wLjE6MzAwMCIsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MzAwMCIsInN1YiI6IjM5In0.APxDVzu2azRuno4Fsb86auNCRT0LBGCI0uvkT-vj2XVdxKOtAyZpFVMtiWDx-ALzzOKu6tmEjUcG-zGdlBmFT1yZAf5PRkFfcFDs0j81l--gKlvgK3aVsgZ4YsWEyzDj0Q9wdElYMyu7P-dBGtPJilWlr-z7YrenIZdpWzFTOY7V5s8k',
    cert_pub,
  ),
);
