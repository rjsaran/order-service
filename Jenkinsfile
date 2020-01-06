registry = 'https://652076111489.dkr.ecr.ap-southeast-1.amazonaws.com'

imageName = 'order-service-prod'

// TODO Replace with ELB or Auto Discovery

managerIp = "10.10.4.69"

def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}

node('slaves') {
    stage('Checkout') {
        checkout scm
    }

    stage('Test') {

    }

    stage('Build') {
        docker.build("${imageName}")
    }

    stage('Push') {
        docker.withRegistry(registry, 'ecr:ap-southeast-1:ec2_registry') {
            docker.image(imageName).push("${commitID()}")

            if (env.BRANCH_NAME == 'master') {
              docker.image(imageName).push('latest')
            }
        }
    }
}

node('master') {
    stage('Checkout') {
        checkout scm
    }

    stage('Copy') {
         sshagent(['DockerSwarmManager']) {
            sh "scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@${managerIp}:/home/ubuntu"
        }
    }

    stage('Deploy') {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'aws_ecr', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            sshagent(['DockerSwarmManager']) {
                sh "ssh -oStrictHostKeyChecking=no ubuntu@${managerIp} sudo docker login --password $PASSWORD --username $USERNAME ${registry}"
                sh "ssh -oStrictHostKeyChecking=no ubuntu@${managerIp} sudo docker stack deploy --compose-file docker-compose.yml --with-registry-auth ${imageName}"
            }
        }
    }
}