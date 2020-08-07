LBARN = 'aws elbv2 describe-load-balancers --names "model-garden-devops-lb" --query LoadBalancers[*].LoadBalancerArn --output text'
echo $LBARN
if [$LBARN != ""]
then
echo "load balancer present"
else
aws elbv2 create-load-balancer --name model-garden-devops-lb --subnets subnet-17d4107d subnet-e7dae99a subnet-dac9cf97 --security-groups sg-3b02fc5b sg-03b6a18f51a8cc356 sg-0153652719fde0da0 sg-0dbd4a9079111917d
fi
LBARN = 'aws elbv2 describe-load-balancers --names "model-garden-devops-lb" --query LoadBalancers[*].LoadBalancerArn --output text'

tg_mg_frontend = 'aws elbv2 describe-target-groups --names model-garden-frontend-devops --query TargetGroups[*].TargetGroupArn --output text'
echo $tg_mg_frontend
if [$LBARN != "" -a $tg_mg_frontend != ""]
then
echo "load balancer frontend target group present"
elif [$LBARN != ""]
aws elbv2 create-target-group --name model-garden-frontend-devops --protocol HTTP --port 80 --target-type ip --vpc-id vpc-88b8a5e3
aws elbv2 create-listener --load-balancer-arn $lb_arn --protocol HTTP --port 80  --default-actions Type=forward,TargetGroupArn=$tg_mg_frontend
else
echo "loadbalancer not present"
fi

tg_mg_backend =  'aws elbv2 describe-target-groups --names model-garden-backend-devops --query TargetGroups[*].TargetGroupArn --output text'
echo $tg_mg_backend
if [$LBARN != "" -a $tg_mg_backend != ""]
then
echo "load balancer backend target group present"
elif [$LBARN != ""]
aws elbv2 create-target-group --name model-garden-backend-devops --protocol HTTP --port 9000 --target-type ip --vpc-id vpc-88b8a5e3 --health-check-path /health_check/
aws elbv2 create-listener --load-balancer-arn $lb_arn --protocol HTTP --port 9000  --default-actions Type=forward,TargetGroupArn=$tg_mg_backend
else
echo "loadbalancer not present"
fi