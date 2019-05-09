# check-for-node-dep-changes

This is a GitHub action for Node projects to check if the dependencies have changed since the last commit on the current branch. 

I've tested it on most of my projects and I'm pretty convinced that it's reliable but pretty != 100%. As of right now, I would only rely on this project to do reversible things that don't affect production. Do note that GitHub Actions itself is in beta and is not 100% reliable - I've dealt with its quirks several times. 

That said, if you're comfortable with those caveats, this action is pretty simple:

```javascript
action "detect dependency changes" {
  uses = "bencooper222/check-for-node-dep-changes@master"
  secrets = ["GITHUB_TOKEN"]
}
```
If dependencies have changed (both normal and dev), any actions that `uses` this action will proceed. Otherwise, that chain of actions will end. 
