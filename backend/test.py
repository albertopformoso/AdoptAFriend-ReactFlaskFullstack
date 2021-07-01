#%%
import requests
import json
# %%
headers = {'content-type': 'application/json'}
body = {
    'username': 'albertopformoso@gmail.com',
    'password': '123456'
}
res = requests.post(
    'http://127.0.0.1:5000/auth',
    json=body
)
# %%
print(res)
# %%
print(res.text)
# %%
