# Mystery3AtDrexel Disclaimer

Since Google secrets are required to login to the webapp, a video has been included for demo purposes.

https://www.youtube.com/watch?v=emE_MVhzbA0

# CI 102 Lab 63 Group 11

# Tasky

A simple to-do task manager to easily organize your workday!

## How to run locally
1. git clone the repo
2. Install Node.JS 20 (https://nodejs.org/en/download)
3. Install Docker Engine (https://docs.docker.com/engine/install/)
4. Go to the root directory of the project
5. Create a .env file and add the following

```
GOOGLE_CLIENT_ID=[add your google client id]
GOOGLE_CLIENT_SECRET=[add your google client secret]
COOKIE_SECRET=[add your cookie secret]
```
6. Ask @ok93 for these variables (they are secret so they can't be stored in the repo)
7. Run ```docker compose up``` in the root directory to start the app
8. Client should start running at http://localhost:3000

## How to make changes

1. git clone repo
2. run `git checkout main` and `git pull` before creating new branch
3. create a branch for your changes by running
```git checkout -b some-meaningful-branch-name```
4. Make changes ...
5. Run ```git add [changed files]``` to stage changes
6. Run ```git commit -m "Some meaningful commit message"``` to create a commit
7. Run ```git push``` to send your changes to remote repo
8. Go to Merge Requests page on the Gitlab page of the project
9. Click "New Merge Request" and then set the source branch as the branch with your changes and target branch as main.
10. Let someone review your merge request and merge it once it is approved by the reviewer.

## Support
For any issues email ok93@drexel.edu, ml3794@drexel.edu, or et542@drexel.edu
