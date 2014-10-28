/*
 * 1) lat
 * 2) lat.lub(level_1, ..., level_2)
 * 3) lat.leq(level_1, level_2)
 * 4) lat.bot
 * 5) lat.top 
 */

(function(exports) {
   lat = {};

   lat.top = 5;
   lat.bot = 0;

   lat.eq = function(level_1, level_2) {
   	return this.leq(level_1, level_2) && this.leq(level_2, level_1); 
   };
   
   lat.parseString = function(level_str) {
      return parseInt(level_str, 10);
   };

   lat.processArgs = function(args) {
      var i, len;
      for ( i = 0, len = args.length; i < len; i++) {
         if (( typeof args[i]) === 'string') {
            args[i] = this.parseString(args[i]);
         } else if ((typeof args[i] === 'undefined')) {
            args[i] = this.bot; 
         } else if ((typeof args[i] === 'null')) {
            args[i] = this.bot; 
         }
      }
   };

   lat.lub = function() {
      var i, len, lub = this.bot;
      this.processArgs(arguments);
      for ( i = 0, len = arguments.length; i < len; i++) {
         if (!this.leqInternal(arguments[i], lub)) {
            lub = arguments[i];
         }
      }
      return lub;
   };
   
   lat.glb = function() {
      var i, len, glb = this.top;
      this.processArgs(arguments);
      for ( i = 0, len = arguments.length; i < len; i++) {
         if (this.leqInternal(arguments[i], glb)) {
            glb = arguments[i];
         }
      }
      return glb;
   };

   lat.leqInternal = function(lev_1, lev_2) {
      if (!lev_2) lev_2 = this.bot; 
      return lev_1 <= lev_2;
   };

   lat.leq = function(lev_1, lev_2) {
      this.processArgs(arguments);
      return this.leqInternal(lev_1, lev_2);
   }; 
   
   exports.lat = lat; 
})($runtime);
