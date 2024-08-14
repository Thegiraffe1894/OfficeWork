var arr = [];
var aut = new GlideAggregate('x_inmpl_automation_automation_cases');
aut.addAggregate('COUNT','number');
aut.groupBy('number');
aut.addHaving('COUNT', '>', 1);
aut.query();
while(aut.next()){
	var num = new GlideRecord('x_inmpl_automation_automation_cases');
	num.addQuery('number',aut.number);
	num.orderByDesc('sys_created_on');
	num.query();
	if(num.next()){
		num.number = new global.NumberManager('x_inmpl_automation_automation_cases').getNextObjNumberPadded();
		gs.info(num.number);
		num.update();
	}
}
