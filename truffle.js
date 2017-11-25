module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "www.blockathon.asia",
      port: 8545,
      network_id: 4,
      from: "0x0f465B76bF53dCbbA541B20Ab1786a1D96297577" // Match any network id
    }
  }
};