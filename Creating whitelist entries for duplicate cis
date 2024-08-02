var name, array, sysid, announce;
var we = new GlideRecord('x_inmpl_automation_whitelisted_test_cis'); //whitelist table
we.addNotNullQuery('configuration_item.name'); //adding not null to config item as we are checking for the duplicates based on the name field
we.query();
while (we.next()) {
    name = we.configuration_item.getDisplayValue();
    sysid = we.configuration_item;
    array = checkciname(name, sysid).split(',');
    for (var i = 0; i < array.length; i++) {
        announce = createwhitelistentries(array[i], we);
        gs.info(announce);
    }
}

function checkciname(ciname, cisysid) { //check if a duplicate ci exists with the same name but a different sys id
    var sysidarray = [];
    var ci = new GlideRecord('cmdb_ci');
    ci.addQuery('name', ciname);
    ci.addQuery('sys_id', '!=', cisysid); // check for, if the sys id is different
    ci.query();
    while (ci.next()) {
        sysidarray.push(ci.sys_id.toString());
    }
    return sysidarray.toString(); // returning all the sysids in an array
}

function createwhitelistentries(cisysid, val) { // creating whitelist entries if it already doesn't exists
    var prefix, value;
    var we_new = new GlideRecord('x_inmpl_automation_whitelisted_test_cis');
    we_new.addQuery('configuration_item', cisysid); //check if there is a entry for the same sys id
    we_new.query();
    if (!we_new.next()) { //skip the creation if the entry for the sys id already exists
        prefix = "create a new entry ";
        we_new.initialize();
        we_new.configuration_item = cisysid;
        we_new.requested_by = val.requested_by;
        we_new.notes = val.notes;
        we_new.prod_ci_marked_for_testing = val.prod_ci_marked_for_testing;
        value = we_new.insert();
        return prefix + value; // return the sys id of the newly created whitelist entry
    } else {
        prefix = "already exists ";
        value = we_new.getDisplayValue();
        return prefix + value;
    }
}
