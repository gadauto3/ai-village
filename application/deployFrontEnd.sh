#!/bin/bash
cd frontend
npx babel src --out-dir public/js --presets react-app/prod
cd ..
terraform apply -auto-approve
