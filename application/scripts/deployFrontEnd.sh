#!/bin/bash
cd frontend
npm run build
cd ..
terraform apply -auto-approve
