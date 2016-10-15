'use babel';

import pathutil from 'path';
import github from './auth';
import File from "./file";
import Promise from 'bluebird';

export default class Directory {
	constructor(repo, path, local_path, mode, sha, parent=null) {
		this.repo = repo;
		this.path = path;
		this.local_path = local_path;
		this.mode = undefined; 
		this.sha = sha;
		this.parent = parent;

		this.modified = false;
		this.modified_childs = [];
	}

	get isRoot() {
		return this.path === "/";
	}

	get local() {
		return this.local_path;
	}

	get remote() {
		return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/tree/" + this.repo.branch + this.path;
	}

	get root() {
		return "https://github.com/" + this.repo.owner + "/" + this.repo.name + "/tree/" + this.repo.branch + "/";
	}

	sort() {
		this.folders.sort(function (a, b) {
			if (a.name == b.name)
				return 0;
			return a.name > b.name ? 1 : -1;
		});

		this.files.sort(function (a, b) {
			if (a.name == b.name)
				return 0;
			return a.name > b.name ? 1 : -1;
		});
	}

	exists(name, isdir) {
		if (isdir) {
			for (var a = 0, b = this.folders.length; a < b; ++a)
				if (this.folders[a].name == name)
					return a;
		} else {
			for (var a = 0, b = this.files.length; a < b; ++a)
				if (this.files[a].name == name)
					return a;
		}
		return null;
	}

	open() {
		if (typeof this.files != "undefined") {
			callback();
			return;
		}
		return this._fetchListComplete()
	}

	_fetchListComplete() {
		let such_nice_promise = new Promise( (resolve, reject) => {
			let such_magic_promise = github.gitdata.getTree({
				owner: this.repo.owner,
				repo: this.repo.name,
				sha: this.sha,
			});
			let files = [];
			let folders = [];
			let such_magic_function = res => {
				res.tree.forEach(obj => {
					if (obj.type == "blob") {
						files.push(
							new File(this.repo, pathutil.join(this.path, obj.path), pathutil.join(this.local_path, obj.path), obj.mode, obj.sha, this)
						)
					} else if (obj.type == "tree") {
						folders.push(
							new Directory(this.repo, pathutil.join(this.path, obj.path) + "/", pathutil.join(this.path, obj.path) + "/", obj.mode, obj.sha, this)
						)
					}
				})
				if (res.truncated) {
					github.getNextPage(res).then(such_magic_function);
				}
			};
			such_magic_promise.then(such_magic_function).catch(err => { reject(err); throw err; });
			such_magic_promise.then( () => {
				this.files = files;
				this.folders = folders;
				this.sort();
				resolve(null);
			});
		});
		return such_nice_promise;
	}

	// This collects the changes on the whole working tree
	// Returns a Promise containing 
	saveRemote() {
		if (!cur.modified) return new Promise((resolve, reject) => { resolve([]); });
		
		Promise.all(this.modified_childs.map(child => {
			return child.saveRemote().then(sha => { 
				return {
					path: pathutil.basename(child.path),
					mode: child.mode,
					type: typeof child == "File" ? "blob" : "tree",
					sha: sha
				};
			});
		})).then(trees => {
			return github.gitdata.createTree(trees, this.sha);
		}).then(obj => {
			return [obj.sha];
		});
	}
}