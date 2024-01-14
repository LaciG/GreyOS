/*
    GreyOS - Bat (Version: 1.7)

    File name: bat.js
    Description: This file contains the Bat - System services development module.

    Coded by George Delaportas (G0D)
    Copyright © 2021 - 2024
    Open Software License (OSL 3.0)
*/

// Bat
function bat()
{
    var self = this;

    function service_config_model()
    {
        this.sys_name = null;
        this.name = null;
        this.icon = 'svc_default';
        this.visible_in_super_tray = true;
    }

    function dynamic_function_model()
    {
        this.name = null;
        this.body = null;
    }

    this.config = function()
    {
        if (is_init === false)
            return false;

        return service_config;
    };

    this.set_function = function(name, body)
    {
        if (is_init === false)
            return false;

        if (utils_sys.validation.alpha.is_symbol(name) || !utils_sys.validation.misc.is_function(body))
            return false;

        var __new_dynamic_function = new dynamic_function_model();

        __new_dynamic_function.name = name;
        __new_dynamic_function.body = function(args) { body.call(this, args); };

        dynamic_functions_list.push(__new_dynamic_function);

        return true;
    };

    this.exec_function = function(func_name, func_args = [])
    {
        if (is_init === false)
            return false;

        if (utils_sys.validation.alpha.is_symbol(func_name) || !utils_sys.validation.misc.is_array(func_args))
            return false;

        var __functions_list_length = dynamic_functions_list.length;

        for (var i = 0; i < __functions_list_length; i++)
        {
            if (dynamic_functions_list[i].name === func_name)
            {
                var func_body = dynamic_functions_list[i].body;

                on_run_calls_list.push({func_args, func_body});
            }
        }

        return true;
    };

    this.on = function(this_event, this_handler)
    {
        if (is_init === false)
            return false;

        if (utils_sys.validation.misc.is_undefined(this_event) || utils_sys.validation.misc.is_undefined(this_handler))
            return false;

        if (utils_sys.misc.contains(this_event, events_list))
            return morpheus.store(service_config.sys_name, 'main', this_event, this_handler, document);

        return false;
    };

    this.register = function(action = null)
    {
        if (is_init === false)
            return false;

        if (!super_tray.add(self, service_config.visible_in_super_tray, action))
        {
            owl.status.services.set(service_config.sys_name, service_config.name, 'FAIL');

            return false;
        }

        morpheus.execute(service_config.sys_name, 'main', 'register');

        var __calls_list_length = on_run_calls_list.length;

        for (var i = 0; i < __calls_list_length; i++)
            on_run_calls_list[i]['func_body'].call(this, on_run_calls_list[i]['func_args']);

        owl.status.services.set(service_config.sys_name, service_config.name, 'RUN');

        if (backtrace === true)
            frog('BAT', 'Services :: Register', service_config);

        return true;
    };

    this.unregister = function()
    {
        if (is_init === false)
            return false;

        dynamic_functions_list = [];
        on_run_calls_list = [];

        if (!super_tray.remove(service_config.sys_name))
        {
            owl.status.services.set(service_config.sys_name, service_config.name, 'FAIL');

            return false;
        }

        morpheus.execute(service_config.sys_name, 'main', 'unregister');

        owl.status.services.set(service_config.sys_name, service_config.name, 'END');

        if (backtrace === true)
            frog('BAT', 'Services :: Unregister', service_config);

        return true;
    };

    this.init = function(svc_name, icon = null, visible_in_super_tray = true)
    {
        if (is_init === true)
            return false;

        if (utils_sys.validation.misc.is_nothing(cosmos))
            return false;

        if (utils_sys.validation.misc.is_undefined(svc_name) || 
            utils_sys.validation.alpha.is_blank(svc_name) || 
            utils_sys.validation.alpha.is_symbol(svc_name) || 
            (icon !== null && utils_sys.validation.alpha.is_blank(icon)) || 
            !utils_sys.validation.misc.is_bool(visible_in_super_tray))
            return false;

        service_config.sys_name = svc_name.toLowerCase().replace(/\s/g,'_') + '_' + random.generate();
        service_config.name = svc_name.trim();
        service_config.icon = (icon === null) ? 'svc_default' : icon;
        service_config.visible_in_super_tray = visible_in_super_tray;

        is_init = true;

        return true;
    };

    this.backtrace = function(val)
    {
        if (utils_sys.validation.misc.is_nothing(cosmos))
            return false;

        if (!utils_sys.validation.misc.is_bool(val))
            return false;

        backtrace = val;

        return true;
    };

    this.cosmos = function(cosmos_object)
    {
        if (utils_sys.validation.misc.is_undefined(cosmos_object))
            return false;

        cosmos = cosmos_object;

        matrix = cosmos.hub.access('matrix');

        morpheus = matrix.get('morpheus');
        super_tray = matrix.get('super_tray');
        owl = matrix.get('owl');

        return true;
    };

    var is_init = false,
        backtrace = false,
        cosmos = null,
        matrix = null,
        morpheus = null,
        super_tray = null,
        owl = null,
        events_list = ['register', 'unregister'],
        dynamic_functions_list = [],
        on_run_calls_list = [],
        utils_sys = new vulcan(),
        random = new pythia(),
        service_config = new service_config_model();
}
