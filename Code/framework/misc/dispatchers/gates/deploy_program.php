<?php
	/*
		Deploy Program (Programmable gate for apps & services deployment)
		
		File name: deploy_program.php
		Description: This file contains the deploy program gate.
		
		Coded by George Delaportas (G0D)
		Copyright (C) 2023 - 2024
		Open Software License (OSL 3.0)
	*/

    // Check for direct access
    if (!defined('micro_mvc'))
        exit();

	// Load helper extensions
    UTIL::Load_Extension('arkangel', 'php');

    // Check for missing general arguments
    if (empty($_POST['program_name']))
	{
		echo '-1';

		return;
	}

	// Check for existing program name
	if (isset($_POST['check_existing']) && isset($_POST['program_type']) && isset($_POST['program_name']))
	{
		$my_profile = ARKANGEL::Fetch_My_Profile();

		if (!$my_profile)
		{
			echo '-1';

			return;
		}

		$program_name = trim($_POST['program_name']);

		foreach ($my_profile['user_programs'][$_POST['program_type'] . 's'] as $this_program)
		{
			if ($program_name === $this_program['name'])
			{
				echo '1';

				return;
			}
		}

		echo '0';

		return;
	}

	// Check for empty program source and model
	if (empty($_POST['program_source']) || empty($_POST['program_model']))
	{
		echo '-1';

		return;
	}

	$program_model = json_decode($_POST['program_model'], true);

	if (json_last_error() !== JSON_ERROR_NONE)
	{
		echo '-1';

		return;
	}

	if (!isset($program_model['icon']) || !isset($program_model['name']) || !isset($program_model['type']))
	{
		echo '-1';

		return;
	}

	$my_profile = ARKANGEL::Fetch_My_Profile();

	$program_name = trim($_POST['program_name']);
	$program_source = $_POST['program_source'];
	$program_run = minify_source($_POST['program_source']);
	$program = array($program_name, $program_model, $program_source, $program_run);

	$user_profile = deploy_program($my_profile, $program);

	if (!ARKANGEL::Update_Profile($user_profile))
	{
		echo '-1';

		return;
	}

	echo '1';

    function minify_source($js_data)
    {
		$js_source = trim($js_data);

		$js_source = str_replace("\t", " ", $js_data);

        $js_source = preg_replace('/\n(\s+)?\/\/[^\n]*/', "", $js_source);
        $js_source = preg_replace("!/\*[^*]*\*+([^/][^*]*\*+)*/!", "", $js_source);
		$js_source = preg_replace("/\/\*[^\/]*\*\//", "", $js_source);
		$js_source = preg_replace("/\/\*\*((\r\n|\n) \*[^\n]*)+(\r\n|\n) \*\//", "", $js_source);

        $js_source = str_replace("\r", "", $js_source);

		$js_source = preg_replace("/\s+\n/", "\n", $js_source);
		$js_source = preg_replace("/\n\s+/", "\n ", $js_source);
		$js_source = preg_replace("/ +/", " ", $js_source);

		$js_source = preg_replace("/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/", "", $js_source);

		return $js_source;
	}

	function deploy_program($profile, $program)
	{
		$email = $profile['email'];
		$username = substr($email, 0, strpos($email, '@'));
		$is_match_found = false;

		foreach ($profile['user_programs'][$program[1]['type'] . 's'] as $this_program)
		{
			if ($program[0] === $this_program['name'])
			{
				$is_match_found = true;

				break;
			}
		}

		if (!$is_match_found)
		{
			$new_program = array('name' 		=> 	$program[0],
								 'icon' 		=> 	$program[1]['icon'],
								 'last_run' 	=> 	null);

			array_push($profile['user_programs'][$program[1]['type'] . 's'], $new_program);
		}

		$file_path = UTIL::Absolute_Path('fs/' . $username);

		mkdir($file_path . '/programs/source/' . $program[0], 0700);
		mkdir($file_path . '/programs/run/' . $program[0], 0700);

		file_put_contents($file_path . '/programs/source/' . $program[0] . '/' . $program[0] . '.js', $program[2]);
		file_put_contents($file_path . '/programs/run/' . $program[0] . '/' . $program[0] . '.js', $program[3]);

		return $profile;
	}
?>
