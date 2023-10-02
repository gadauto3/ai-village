#!/bin/bash
cd frontend/
npm run build
echo Done building
cd ..
terraform apply -auto-approve
