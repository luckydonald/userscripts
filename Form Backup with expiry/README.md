# Backup textareas content for accidental losses. Automatically remove abandoned backups after preferred time span.



##### Version: 2.4

This script was originally based on [Textarea Backup](http://userscripts-mirror.org/scripts/show/7671) by [Dan Brook](http://userscripts-mirror.org/people/8014). [Crend King](https://noflr.userscripts-mirror.org/users/30685) mainly added the expiration functionality to it, so that an abandoned backup will be automatically deleted after certain time span. This is especially useful if there is not a submit action for the textarea's associated form (e.g. [Google Translate](http://translate.google.com/)).

Since version 2.0, Crend King decided to rewrite the script and maintain the whole code himself, since Dan didn't update his script for a long time. Some behaviors are slightly changed in this version. The new version behaves as follows:

For every page, once loaded the script checks if any backup is expired. If yes, delete it.
No matter if there is a backup for this page or not, the script will not restore any textarea autonomously.
Whenever a textarea is focused (by clicking it or use Tab key), and there is a backup for it, the script shows a confirmation window or automatically restores, depending on preference.
Once a restore offer is declined, the script will not use that backup anymore within the page lifetime. It then becomes vulnerable to be overwritten.
Whenever textarea loses focus, or after preferred time span (depending on preference), the script backups textarea content if anything is changed.
Comparing to the original script, the keypress backup is removed, because it overkills.
The logic behind this is, it only restore what user interests, and ignore the rest. Similarly, desktop softwares only check updates when launched. If it is never used, why bother checking updates?

### Options

- `blur_backup`: control backup textarea when it loses focus. (default: `true`)
- `timely_backup_interval`: interval for timely backup, in millisecond. 0 disables timely backup. (default: `0`, _disable timely backup_)
- `keep_after_submission`: keep backup even form is submitted. Make sure expiration is enabled or backup will never be deleted. (default: `false`)
- `confirm_overwrite`: set to true if you want a a confirmation window of restoration is displayed. Otherwise, the restoration is carried out unconditionally. (default: `true`)
expire_after_xxx: control the time a backup will expire. If a textarea is backed up but never used, the backup will be deleted after this time. The check is carried out when the script is loaded, thus no need to visit the original URL. Specify 0 to disable expiration. (default: `0` day, `0` hours and `30` minutes)

Please open the script file to change the options.

### Version history

#### 2.4 on 2013-08-15
- Support Google Chrome.

#### 2.3 on 2013-07-20
- Support dynamically created textareas. To restore, such textareas need to be created first and then use the script command.

#### 2.2.1 on 2013-01-06
- Remove restriction for textarea under a form.

#### 2.2 on 2013-01-03
- Add support for elements with "contentEditable" attribute.

#### 2.1 on 2011-05-09
- Add user menu command to restore all textarea in the page.

#### 2.0 on 2011-05-06
- Completely rewrite the script. New script should be faster, stronger and more standard-compliant.
- Fix bugs in previous versions and the original script.

#### 1.0.4 on 2009-04-22
- Synchronize with the original Textarea Backup script.

#### 1.0.3 on 2009-03-08
- Add "ask overwrite" option.

#### 1.0.2 on 2009-03-04
- Add "keep after submission" option.

#### 1.0.1 on 2009-02-22
- Extract the expiry time stamp codes to stand-alone functions.

#### 1.0 on 2009-02-21
- Initial version.
