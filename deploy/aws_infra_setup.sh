#!/usr/bin/env bash

# This script for deployment of following infrastructure components:
#   * AWS load-balancer
#   * AWS target groups
#   * AWS listeners
#
# Usage:
#   ./develop/aws_infra_setup.sh prod
#

# Get parameter for environment.
_ENV="${1:-devops}"
# Exit script in case of failure.
  set -e 
  set -o pipefail
  
# Check AWS load balancer presence and create if it is absent.
# Load balancer Amazon Resource Number - LB ARN.
LBARN = 'aws elbv2 describe-load-balancers --names "model-garden-${_ENV}-lb" --query LoadBalancers[*].LoadBalancerArn --output text'
echo $LBARN
if [$LBARN != ""]
then
    echo "Load balancer is present."
else
    aws elbv2 create-load-balancer --name model-garden-${_ENV}-lb --subnets subnet-17d4107d subnet-e7dae99a subnet-dac9cf97 --security-groups sg-3b02fc5b sg-03b6a18f51a8cc356 sg-0153652719fde0da0 sg-0dbd4a9079111917d
fi

# Update LB ARN after creation.
LBARN = 'aws elbv2 describe-load-balancers --names "model-garden-${_ENV}-lb" --query LoadBalancers[*].LoadBalancerArn --output text'

# AWS target group check and creation for frontend service.
# AWS listener creation for frontend.
tg_mg_frontend = 'aws elbv2 describe-target-groups --names model-garden-frontend-${_ENV} --query TargetGroups[*].TargetGroupArn --output text'
echo $tg_mg_frontend

# Check if load balancer and target group present for frontend service and create  AWS target group and listener if they absent.
if [$LBARN != "" -a $tg_mg_frontend != ""]
then
    echo "Load balancer frontend target group present."
elif [$LBARN != ""]
    aws elbv2 create-target-group --name model-garden-frontend-${_ENV} --protocol HTTP --port 80 --target-type ip --vpc-id vpc-88b8a5e3
    aws elbv2 create-listener --load-balancer-arn $lb_arn --protocol HTTP --port 80  --default-actions Type=forward,TargetGroupArn=$tg_mg_frontend
else
    echo "Loadbalancer is not present."
fi

# AWS target group check and creation for backend service.
# AWS listener creation for backend.
tg_mg_backend =  'aws elbv2 describe-target-groups --names model-garden-backend-${_ENV} --query TargetGroups[*].TargetGroupArn --output text'
echo $tg_mg_backend

# Check if load balancer and target group present for backend service and create  AWS target group and listener if they absent.
if [$LBARN != "" -a $tg_mg_backend != ""]
then
    echo "Load balancer backend target group present."
elif [$LBARN != ""]
    aws elbv2 create-target-group --name model-garden-backend-${_ENV} --protocol HTTP --port 9000 --target-type ip --vpc-id vpc-88b8a5e3 --health-check-path /health_check/
    aws elbv2 create-listener --load-balancer-arn $lb_arn --protocol HTTP --port 9000  --default-actions Type=forward,TargetGroupArn=$tg_mg_backend
else
    echo "Load balancer is not present."
fi
