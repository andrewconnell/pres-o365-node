'use strict';

var GulpConfig = (function () {
  function GulpConfig() {
    this.source    = './src/';
    this.clientApp = this.source + 'app/';
    this.serverApp = this.source + 'server/';

    //this.allJavaScript = [this.source + 'js/**/*.js'];
    this.allTypeScript       = this.source + '**/*.ts';
    this.allClientTypeScript = this.clientApp + '**/*.ts';
    this.allServerTypeScript = this.serverApp + '**/*.ts';

    this.typings         = './tools/typings/';
    this.libTsDefs       = this.typings + '*/*.d.ts';
    this.libTsDefList    = this.typings + 'tsd.d.ts';
    this.clientTsDefList = this.typings + 'app.d.ts';
    this.serverTsDefList = this.typings + 'server.d.ts';
    this.customTsDefList = this.typings + 'custom.d.ts';
  }

  return GulpConfig;
})();

module.exports = GulpConfig;
