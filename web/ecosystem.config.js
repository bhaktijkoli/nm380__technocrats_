const path = require('path');
const config = require('dotenv').config({path: path.join(__dirname, '.env')}).parsed;
const configDeploy = require('dotenv').config({path: path.join(__dirname, '.env.deployment')}).parsed;

module.exports = {
    apps: [
        {
            name: 'technocrats-web',
            script: 'yarn start',
            args: '',
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
            env_production: {
                NODE_ENV: 'production',
                ...config,
            },
        },
    ],
    deploy: {
        production: {
            key: configDeploy.DEPLOYMENT_KEY,
            user: configDeploy.DEPLOYMENT_USER,
            host: [configDeploy.DEPLOYMENT_HOST],
            ref: 'origin/master',
            repo: 'git@github.com:bhaktijkoli/nm380__technocrats_.git',
            path: '~/technocrats-web',
            'forward-agent': true,
            'post-deploy':
                'cd web && yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env production --update-env',
        },
    },
};
