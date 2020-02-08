/* st-dynamic.js */

st.dynamic = {
	init: function() {
		st.log("init dynamic");
	},
	loadChar: function(uri) {
		var char = uri.split(":")[1];
		st.log("loading char dynamic char[" + char + "]");
		
		switch (char) {
			case 'fciw':
				break;
		}		
	},
	loadBaseChar: function() {
		st.log("char response");
				
		var csvSpec = {};
		for (var i=0;i<data.length;i++) {
			var stat = {};
			stat.name = data[i]["Stat"];
			stat.value = data[i][searchName];
			stat.key = stat.name.toLowerCase();
			csvSpec[stat.key] = stat;
		}
		//st.log(csvSpec);
		
		var spec = {};
		st.character.spec = spec;
		
		spec.allegiance = csvSpec["allegiance"].value;
		spec.overview = {};
		spec.overview["name"] = csvSpec["name"].value;
		spec.overview["ship"] = csvSpec["ship"].value;
		spec.overview["position"] = csvSpec["position"].value;
		spec.overview["searchName"] = searchName;
		spec.overview["quote"] = csvSpec["quote"].value;

		spec.demographics = {};
		spec.demographics["sex"] = csvSpec["sex"].value;
		spec.demographics["race"] = csvSpec["race"].value;
		spec.demographics["psionic"] = csvSpec["psionic"].value;
		
		spec.attributes = {};
		
		// physical
		spec.attributes["str"] = csvSpec["str"].value;
		spec.attributes["siz"] = csvSpec["siz"].value;
		spec.attributes["end"] = csvSpec["end"].value;
		spec.attributes["ini"] = csvSpec["ini"].value;
		spec.attributes["dex"] = csvSpec["dex"].value;
		
		// mental
		spec.attributes["per"] = csvSpec["per"].value;
		spec.attributes["wil"] = csvSpec["wil"].value;
		spec.attributes["cha"] = csvSpec["cha"].value;
		spec.attributes["rea"] = csvSpec["rea"].value;
		spec.attributes["emp"] = csvSpec["emp"].value;
		
		spec.attributes["hp"] = st.character.calcHp();
		
		spec.skills = {};
		
		var skills0 = {};
		skills0["administration"] = csvSpec["administration"].value;
		skills0["astronomy"] = csvSpec["astronomy"].value;
		skills0["anthropology"] = csvSpec["anthropology"].value;
		skills0["bargain"] = csvSpec["bargain"].value;
		skills0["chemistry"] = csvSpec["chemistry"].value;
		skills0["comms systems"] = csvSpec["comms systems"].value;
		skills0["computer science"] = csvSpec["computer science"].value;
		skills0["demolitions"] = csvSpec["demolitions"].value;
		skills0["detector ops"] = csvSpec["detector ops"].value;
		skills0["disguise"] = csvSpec["disguise"].value;
		skills0["economics"] = csvSpec["economics"].value;
		skills0["electronics"] = csvSpec["electronics"].value;
		skills0["eva"] = csvSpec["eva"].value;
		skills0["farming"] = csvSpec["farming"].value;
		skills0["fast draw"] = csvSpec["fast draw"].value;
		skills0["fast talk"] = csvSpec["fast talk"].value;
		skills0["firearms"] = csvSpec["firearms"].value;
		skills0["first aid"] = csvSpec["first aid"].value;
		skills0["forcewall systems"] = csvSpec["forcewall systems"].value;
		skills0["forgery"] = csvSpec["forgery"].value;
		skills0["gambling"] = csvSpec["gambling"].value;
		spec.skills["0"] = skills0;
		
		var skills1 = {};
		skills1["geology"] = csvSpec["geology"].value;
		skills1["gunnery"] = csvSpec["gunnery"].value;
		skills1["healing"] = csvSpec["healing"].value;
		skills1["heavy weapons"] = csvSpec["heavy weapons"].value;
		skills1["hide"] = csvSpec["hide"].value;
		skills1["history"] = csvSpec["history"].value;
		skills1["interrogation"] = csvSpec["interrogation"].value;
		skills1["law"] = csvSpec["law"].value;
		skills1["leader"] = csvSpec["leader"].value;
		skills1["linguistics"] = csvSpec["linguistics"].value;
		skills1["mathematics"] = csvSpec["mathematics"].value;
		skills1["mechanical"] = csvSpec["mechanical"].value;
		skills1["medical"] = csvSpec["medical"].value;
		skills1["melee weapons"] = csvSpec["melee weapons"].value;
		skills1["mining"] = csvSpec["mining"].value;
		skills1["missle weapons"] = csvSpec["missle weapons"].value;
		skills1["navigation"] = csvSpec["navigation"].value;
		skills1["physics"] = csvSpec["physics"].value;
		skills1["pick pocket"] = csvSpec["pick pocket"].value;
		skills1["pilot"] = csvSpec["pilot"].value;
		skills1["political science"] = csvSpec["political science"].value;
		spec.skills["1"] = skills1;
		
		var skills2 = {};			
		skills2["probe"] = csvSpec["probe"].value;
		skills2["psychology"] = csvSpec["psychology"].value;
		skills2["research"] = csvSpec["research"].value;
		skills2["recon"] = csvSpec["recon"].value;
		skills2["security systems"] = csvSpec["security systems"].value;
		skills2["ships' tactics"] = csvSpec["ships' tactics"].value;
		skills2["stardrive ops"] = csvSpec["stardrive ops"].value;
		skills2["stealth"] = csvSpec["stealth"].value;
		skills2["streetwise"] = csvSpec["streetwise"].value;
		skills2["surgery"] = csvSpec["surgery"].value;
		skills2["survival"] = csvSpec["survival"].value;
		skills2["swim"] = csvSpec["swim"].value;
		skills2["tactics"] = csvSpec["tactics"].value;
		skills2["teleport systems"] = csvSpec["teleport systems"].value;
		skills2["thrown weapons"] = csvSpec["thrown weapons"].value;
		skills2["unarmed combat"] = csvSpec["unarmed combat"].value;
		skills2["vehicle (air)"] = csvSpec["vehicle (air)"].value;
		skills2["vehicle (ground)"] = csvSpec["vehicle (ground)"].value;
		skills2["vehicle (water)"] = csvSpec["vehicle (water)"].value;
		skills2["weapons systems"] = csvSpec["weapons systems"].value;
		skills2["telepathy"] = csvSpec["telepathy"].value;
		spec.skills["2"] = skills2;
	}
};