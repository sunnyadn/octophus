# Octophus

Live load and edit files from a remote repo on GitHub in atom. Simple and fast!

![image](https://cloud.githubusercontent.com/assets/7262715/19414782/5f188a6a-938b-11e6-90be-fc332ebb0fa1.png)

## Installation

`apm install octophus`

or

Search for `octophus` within package search in the Settings View.

## Usage

**SET UP YOUR GITHUB TOKEN FIRST!** Octophus needs read and write access to your GitHub repo. So make sure you [generated a private access token](https://github.com/settings/tokens/new) for Octophus and [write it in package settings](#Configuration).

**Otophus: Open GitHub Repo**  <kbd>control-option-command-O</kbd> will open a remote repo from GitHub and load it into your atom editor.

**Otophus: Commit with Message**  <kbd>control-option-command-K</kbd> will allow you to save changes with your own message.

As you save the file in the editor, the remote file in your remote repo will be updated as well. Note that there would never be a "commit storm", any new changes will be smartly integrated into one commit. 

## Configuration

Go to *Package Settings* page to finish the configuration.

![image](https://cloud.githubusercontent.com/assets/7262715/19414922/c34079cc-938f-11e6-9084-b33b5d53caf7.png)

**Github Token** is the Private Access Token generated by GitHub, allowing Octophus to read and write files in your GitHub repo. This must be set before other actions.

**Save Timeout** is the minimum interval to upload your changes into GitHub. Default is set to 10s. This option is intended to avoid frequent IO requests.

## Contribution

This is a hackathon idea and is still development. We plan to maintain this package for a longer time. Free free to send us an issue or a pull request!