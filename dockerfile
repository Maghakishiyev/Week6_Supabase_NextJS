FROM node:lts as dependencies
WORKDIR /week6_supabase_nextjs
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:lts as builder
WORKDIR /week6_supabase_nextjs
COPY . .
COPY --from=dependencies /week6_supabase_nextjs/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /week6_supabase_nextjs
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /week6_supabase_nextjs/next.config.js ./
COPY --from=builder /week6_supabase_nextjs/public ./public
COPY --from=builder /week6_supabase_nextjs/.next ./.next
COPY --from=builder /week6_supabase_nextjs/node_modules ./node_modules
COPY --from=builder /week6_supabase_nextjs/package.json ./package.json
#
EXPOSE 3000
CMD ["npm", "start"]