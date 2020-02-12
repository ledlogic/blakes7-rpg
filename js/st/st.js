/* st.js */

var st = {
	log: function(s1, s2) {
		if (typeof(window.console) != "undefined") {
			if (s2) {
				console.log([s1, s2]);
			} else {
				console.log(s1);
			}
		}
	},

	init: function() {
		st.character.init();
		st.dynamic.init();
		st.nav.init();
		st.render.init();
	}
};

$(document).ready(st.init);
