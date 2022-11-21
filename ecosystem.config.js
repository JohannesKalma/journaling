module.exports = {
  apps : [{
    name   : "journalling",
    script : "bin/www",
    watch : true,
    ignore_watch : ["documents"]
  }]
}
