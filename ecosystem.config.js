module.exports = {
  apps : [{
    name   : "journaling",
    script : "bin/www",
    watch : true,
    ignore_watch : ["documents"]
  }]
}
