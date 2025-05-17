/*
    GreyOS - ACE Editor (Version: 1.1)

    File name: ace.js
    Description: This file contains the ACE Editor - Auto loader extension.

    Coded by George Delaportas (G0D/ViR4X)
    Copyright © 2013 - 2025
    Open Software License (OSL 3.0)
*/

function laod_ace()
{
    var dynamic_object = null;

    dynamic_object = document.createElement('script');
    dynamic_object.setAttribute('src', '/framework/extensions/js/user/ace/src/ace-min.js');
    document.getElementsByTagName('body')[0].appendChild(dynamic_object);

    dynamic_object = document.createElement('script');
    dynamic_object.setAttribute('src', '/framework/extensions/js/user/ace/src/ext-language_tools.js');
    document.getElementsByTagName('body')[0].appendChild(dynamic_object);

    dynamic_object = document.createElement('script');
    dynamic_object.setAttribute('src', '/framework/extensions/js/user/ace/src/ext-settings_menu.js');
    document.getElementsByTagName('body')[0].appendChild(dynamic_object);
}

laod_ace();
