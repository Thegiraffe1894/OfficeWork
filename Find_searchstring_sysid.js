var auf = new GlideRecord('x_inmpl_automation_automation_cases'); // table
auf.addEncodedQuery('condition!=NULL');
//auf.addQuery('sys_id','071d94a81b3e8e503d4bddf0b24bcb05');
auf.query();
while (auf.next()){
	var arr = ['application','assignment_group','business_service','caller_id','category','cmdb_ci','domain'];
	//var arr = ['business_service'];
	var condition = auf.condition;
	var lngth = parseInt('32');
	var pos,total,sysid,searchstring;
	for(var i = 0;i<arr.length;i++){
		gs.info(arr[i]);
		if(condition.indexOf(arr[i]+"=") > -1){
			searchstring = arr[i]+"=";
			pos = condition.lastIndexOf(arr[i]+"=") + searchstring.length;
			total = pos + lngth;
			sysid = condition.substr(pos, lngth);
			//gs.info(sysid);
			gs.info("found the match for " + arr[i] + " in automation case " + auf.number + ". The sys id found is " + sysid);
		}
	}
}
