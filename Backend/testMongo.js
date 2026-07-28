const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.opr2gq4.mongodb.net",
  (err, addresses) => {
    console.log(err);
    console.log(addresses);
  }
);