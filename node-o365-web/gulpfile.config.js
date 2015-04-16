'use strict';

var GulpConfig = (function () {
  function GulpConfig() {
    this.source    = './src/';
    this.serverApp = this.source + 'server/';

    this.allTypeScript       = this.source + '**/*.ts';
    this.allServerTypeScript = this.serverApp + '**/*.ts';

    this.typings         = './tools/typings/';
    this.libTsDefs       = this.typings + '*/*.d.ts';
    this.libTsDefList    = this.typings + 'tsd.d.ts';
    this.serverTsDefList = this.typings + 'server.d.ts';
  }

  return GulpConfig;
})();

module.exports = GulpConfig;
