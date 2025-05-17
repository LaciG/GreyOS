/*
    GreyOS - Linux Mode (Version: 1.2)

    File name: linux_mode.js
    Description: This file contains the Linux Mode utility.

    Coded by George Delaportas (G0D/ViR4X)
    Copyright © 2013 - 2024
    Open Software License (OSL 3.0)
*/

// Linux Mode
function linux_mode()
{
    var self = this;

    function utilities()
    {
        this.apply_css_fix = function()
        {
            utils_sys.graphics.apply_theme('/framework/extensions/js/core/linux_mode', 'linux');

            return true;
        };
    }

    this.check = function()
    {
        if (navigator.userAgent.indexOf('Linux') > -1)
            return true;

        return false;
    };

    this.init = function()
    {
        utils_int.apply_css_fix();

        return true;
    };

    var utils_sys = new vulcan(),
        utils_int = new utilities();
}
