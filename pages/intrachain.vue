<template>
  <div class="container">
    <tabs
      :items="[
        {
          label: 'Swap',
          to: getTabLink(),
        },
        { label: 'Pools', to: getTabLink('pools') },
      ]"
    >
    </tabs>

    <div v-if="tab === defaultTab">
      <card-swap>
        <template v-slot:header>
          Swap
        </template>

        <simple-wrapper-slim-sm>
          <search-select
            v-model="walletThree"
            :data="wallets"
            placeholder="Select a token..."
            modal-heading="Select a token"
            style="margin-bottom: 0;"
          >
            <template v-slot:label>
              Blockchain
            </template>
          </search-select>
        </simple-wrapper-slim-sm>

        <btn
          class="btn-link btn-block"
          :class="{
            'link-invert': theme === 'susy',
            'text-primary': theme === 'gravity',
          }"
        >
          Connect new wallet
        </btn>
        <hr class="d-sm-none" />
        <br class="d-none d-sm-block" />
        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Send
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 14px;"
                >
                </form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
              >
                <template v-slot:label>
                  Token
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 0;"
                ></form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>
        <list-data class="d-none d-sm-block">
          <list-data-item>
            Exchange rate:
            <template v-slot:value>—</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>—</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>—</template>
          </list-data-item>
        </list-data>
        <template v-slot:footer>
          <btn class="btn-primary btn-block" disabled>
            Next
          </btn>
          <list-data class="d-sm-none" style="margin-top: 14px;">
            <list-data-item>
              Exchange rate:
              <template v-slot:value>—</template>
            </list-data-item>
            <list-data-item>
              Current pool size:
              <template v-slot:value>—</template>
            </list-data-item>
            <list-data-item style="margin-bottom: 0;">
              Your pool share (50%):
              <template v-slot:value>—</template>
            </list-data-item>
          </list-data>
        </template>
      </card-swap>

      <card-swap>
        <template v-slot:header>
          Swap
        </template>

        <simple-wrapper-slim-sm>
          <search-select
            v-model="walletThree"
            :data="wallets"
            placeholder="Select a token..."
            modal-heading="Select a token"
            style="margin-bottom: 0;"
          >
            <template v-slot:label>
              Blockchain
            </template>
          </search-select>
        </simple-wrapper-slim-sm>

        <br class="d-sm-none" />

        <form-group-between-shift1>
          <template v-slot:left>
            <form-input
              value="0x1015e2182E...6AD26FB9"
              readonly
              icon="/img/icons/metamask.svg"
            >
              <template v-slot:label>
                From address
              </template>
            </form-input>
          </template>
          <template v-slot:right>
            <btn
              class="btn-link link-invert btn-block"
              :class="{
                'text-primary': theme === 'gravity',
              }"
            >
              Change
            </btn>
          </template>
        </form-group-between-shift1>

        <hr class="d-sm-none" style="margin: 0 0 14px 0;" />

        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Send
                  <span class="text-secondary float-right font-weight-normal">
                    Balance: 1
                  </span>
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input value="0" type="number" style="margin-bottom: 14px;">
                <template v-slot:label>
                  <span class="text-secondary float-right font-weight-normal">
                    Gas: 100 Gwei
                  </span>
                </template>
              </form-input>
            </template>
          </form-group-between-shift-invert>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
              >
                <template v-slot:label>
                  Receive
                  <span class="text-secondary float-right font-weight-normal">
                    Price: - ETH per BAND
                  </span>
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 0;"
                ></form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>
        <list-data class="d-none d-sm-block">
          <list-data-item>
            Exchange rate:
            <template v-slot:value>0.10 TRX = 0.3 BTT</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>0.5 TRX = 1 BTT</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>0.2 TRX = 0.2 BTT</template>
          </list-data-item>
        </list-data>
        <template v-slot:footer>
          <btn class="btn-primary btn-block">
            Next
          </btn>
          <list-data class="d-sm-none" style="margin-top: 14px;">
            <list-data-item>
              Exchange rate:
              <template v-slot:value>0.10 TRX = 0.3 BTT</template>
            </list-data-item>
            <list-data-item>
              Current pool size:
              <template v-slot:value>0.5 TRX = 1 BTT</template>
            </list-data-item>
            <list-data-item style="margin-bottom: 0;">
              Your pool share (50%):
              <template v-slot:value>0.2 TRX = 0.2 BTT</template>
            </list-data-item>
          </list-data>
        </template>
      </card-swap>

      <card-swap-final>
        <template v-slot:header>
          Swap
        </template>
        <template v-slot:bodyTop>
          <form-group>
            <transactions-icons :left="walletFirst"></transactions-icons>
          </form-group>
        </template>
        <template v-slot:bodyBottom>
          <form-group>
            <template v-slot:label>
              From address
            </template>
            <div class="text-truncate">
              0xEA3ed91a668B6a56751729016EBafc214dFBeB65
            </div>
          </form-group>

          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                :value="{
                  id: '1',
                  label: 'Ethereum',
                  icon: '/img/icons/ethereum.svg',
                }"
                readonly
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Send
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input
                value="1.1"
                type="number"
                readonly
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  <span class="text-secondary float-right font-weight-normal">
                    Gas: 100 Gwei
                  </span>
                </template>
              </form-input>
            </template>
          </form-group-between-shift-invert>

          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                :value="{
                  id: '1',
                  label: 'Ethereum',
                  icon: '/img/icons/ethereum.svg',
                }"
                readonly
              >
                <template v-slot:label>
                  Send
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input value="1.1" type="number" readonly> </form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </template>

        <br class="d-sm-none" />
        <list-data>
          <list-data-item>
            Exchange rate:
            <template v-slot:value>0.10 TRX = 0.3 BTT</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>0.5 TRX = 1 BTT</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>0.2 TRX = 0.2 BTT</template>
          </list-data-item>
        </list-data>

        <template v-slot:footer>
          <div style="display: flex; justify-content: center;">
            <form-group>
              <checkbox name="terms-of-service" checked>
                Terms of Service
              </checkbox>
            </form-group>
          </div>
          <btn class="btn-primary btn-block">
            Swap
          </btn>
          <btn class="btn-link btn-block">
            Back
          </btn>
        </template>
      </card-swap-final>
    </div>

    <div v-else-if="tab === 'pools'">
      <card-swap>
        <template v-slot:header>
          Pools
        </template>

        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert1>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 0;"
              >
                <template v-slot:label>
                  Blockchain
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <div class="dropdown">
                <btn
                  id="dropdownMenuButton2"
                  v-dropdown
                  class="btn-link dropdown-toggle"
                  style="padding: 0;"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span class="text-body">Add Liquidity</span>
                  <icon class="dropdown-caret">
                    <caret-icon></caret-icon>
                  </icon>
                </btn>
                <div
                  class="dropdown-menu dropdown-menu-center dropdown-menu-sm-right"
                  aria-labelledby="dropdownMenuButton2"
                >
                  <a class="dropdown-item" href="#">Explorer</a>
                  <a class="dropdown-item" href="#">Node control panel</a>
                  <a class="dropdown-item" href="#">FAQ</a>
                  <a class="dropdown-item" href="#">Docs</a>
                  <a class="dropdown-item" href="#">Log out</a>
                </div>
              </div>
            </template>
          </form-group-between-shift-invert1>
        </simple-wrapper-slim-sm>

        <btn
          class="btn-link btn-block"
          :class="{
            'link-invert': theme === 'susy',
            'text-primary': theme === 'gravity',
          }"
        >
          Connect new wallet
        </btn>
        <hr class="d-sm-none" />
        <br class="d-none d-sm-block" />
        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Input
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 14px;"
                >
                </form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
              >
                <template v-slot:label>
                  Input
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 0;"
                ></form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>
        <list-data class="d-none d-sm-block">
          <list-data-item>
            Exchange rate:
            <template v-slot:value>—</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>—</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>—</template>
          </list-data-item>
        </list-data>
        <template v-slot:footer>
          <btn class="btn-primary btn-block" disabled>
            Next
          </btn>
          <list-data class="d-sm-none" style="margin-top: 14px;">
            <list-data-item>
              Exchange rate:
              <template v-slot:value>—</template>
            </list-data-item>
            <list-data-item>
              Current pool size:
              <template v-slot:value>—</template>
            </list-data-item>
            <list-data-item style="margin-bottom: 0;">
              Your pool share (50%):
              <template v-slot:value>—</template>
            </list-data-item>
          </list-data>
        </template>
      </card-swap>

      <card-swap>
        <template v-slot:header>
          Pools
        </template>

        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 0;"
              >
                <template v-slot:label>
                  Blockchain
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label style="justify-content: flex-end;">
                <div class="dropdown">
                  <btn
                    id="dropdownMenuButton3"
                    v-dropdown
                    class="btn-link dropdown-toggle"
                    style="padding: 0;"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="text-body">Add Liquidity</span>
                    <icon class="dropdown-caret">
                      <caret-icon></caret-icon>
                    </icon>
                  </btn>
                  <div
                    class="dropdown-menu dropdown-menu-center dropdown-menu-sm-right"
                    aria-labelledby="dropdownMenuButton3"
                  >
                    <a class="dropdown-item" href="#">Explorer</a>
                    <a class="dropdown-item" href="#">Node control panel</a>
                    <a class="dropdown-item" href="#">FAQ</a>
                    <a class="dropdown-item" href="#">Docs</a>
                    <a class="dropdown-item" href="#">Log out</a>
                  </div>
                </div>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>

        <br class="d-sm-none" />

        <form-group-between-shift1>
          <template v-slot:left>
            <form-input
              value="0x1015e2182E...6AD26FB9"
              readonly
              icon="/img/icons/metamask.svg"
            >
              <template v-slot:label>
                From address
              </template>
            </form-input>
          </template>
          <template v-slot:right>
            <btn
              class="btn-link link-invert btn-block"
              :class="{
                'text-primary': theme === 'gravity',
              }"
            >
              Change
            </btn>
          </template>
        </form-group-between-shift1>

        <hr class="d-sm-none" style="margin: 0 0 14px 0;" />

        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Input
                  <span class="text-secondary float-right font-weight-normal">
                    Pool Balance: 1
                  </span>
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input value="0" type="number" style="margin-bottom: 14px;">
                <template v-slot:label>
                  <span class="text-secondary float-right font-weight-normal">
                    Gas: 100 Gwei
                  </span>
                </template>
              </form-input>
            </template>
          </form-group-between-shift-invert>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
              >
                <template v-slot:label>
                  Input
                  <span class="text-secondary float-right font-weight-normal">
                    Pool Balance: 1
                  </span>
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 0;"
                ></form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>
        <list-data class="d-none d-sm-block">
          <list-data-item>
            Exchange rate:
            <template v-slot:value>0.10 TRX = 0.3 BTT</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>0.5 TRX = 1 BTT</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>0.2 TRX = 0.2 BTT</template>
          </list-data-item>
        </list-data>
        <template v-slot:footer>
          <btn class="btn-success btn-block">
            Add Liquidity
          </btn>
          <btn class="btn-link btn-block">
            Pools
          </btn>
          <list-data class="d-sm-none" style="margin-top: 14px;">
            <list-data-item>
              Exchange rate:
              <template v-slot:value>0.10 TRX = 0.3 BTT</template>
            </list-data-item>
            <list-data-item>
              Current pool size:
              <template v-slot:value>0.5 TRX = 1 BTT</template>
            </list-data-item>
            <list-data-item style="margin-bottom: 0;">
              Your pool share (50%):
              <template v-slot:value>0.2 TRX = 0.2 BTT</template>
            </list-data-item>
          </list-data>
        </template>
      </card-swap>

      <card-swap>
        <template v-slot:header>
          Pools
        </template>

        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 0;"
              >
                <template v-slot:label>
                  Blockchain
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label style="justify-content: flex-end;">
                <div class="dropdown">
                  <btn
                    id="dropdownMenuButton4"
                    v-dropdown
                    class="btn-link dropdown-toggle"
                    style="padding: 0;"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="text-body">Remove Liquidity</span>
                    <icon class="dropdown-caret">
                      <caret-icon></caret-icon>
                    </icon>
                  </btn>
                  <div
                    class="dropdown-menu dropdown-menu-center dropdown-menu-sm-right"
                    aria-labelledby="dropdownMenuButton4"
                  >
                    <a class="dropdown-item" href="#">Explorer</a>
                    <a class="dropdown-item" href="#">Node control panel</a>
                    <a class="dropdown-item" href="#">FAQ</a>
                    <a class="dropdown-item" href="#">Docs</a>
                    <a class="dropdown-item" href="#">Log out</a>
                  </div>
                </div>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>

        <br class="d-sm-none" />

        <form-group-between-shift1>
          <template v-slot:left>
            <form-input
              value="0x1015e2182E...6AD26FB9"
              readonly
              icon="/img/icons/metamask.svg"
            >
              <template v-slot:label>
                From address
              </template>
            </form-input>
          </template>
          <template v-slot:right>
            <btn
              class="btn-link link-invert btn-block"
              :class="{
                'text-primary': theme === 'gravity',
              }"
            >
              Change
            </btn>
          </template>
        </form-group-between-shift1>

        <hr class="d-sm-none" style="margin: 0 0 14px 0;" />

        <simple-wrapper-slim-sm>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Input
                  <span class="text-secondary float-right font-weight-normal">
                    Pool Balance: 1
                  </span>
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input value="0" type="number" style="margin-bottom: 14px;">
                <template v-slot:label>
                  <span class="text-secondary float-right font-weight-normal">
                    Gas: 100 Gwei
                  </span>
                </template>
              </form-input>
            </template>
          </form-group-between-shift-invert>
          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                v-model="walletThree"
                :data="wallets"
                placeholder="Select a token..."
                modal-heading="Select a token"
              >
                <template v-slot:label>
                  Input
                  <span class="text-secondary float-right font-weight-normal">
                    Pool Balance: 1
                  </span>
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input
                  value="0"
                  type="number"
                  style="margin-bottom: 0;"
                ></form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </simple-wrapper-slim-sm>
        <list-data class="d-none d-sm-block">
          <list-data-item>
            Exchange rate:
            <template v-slot:value>0.10 TRX = 0.3 BTT</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>0.5 TRX = 1 BTT</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>0.2 TRX = 0.2 BTT</template>
          </list-data-item>
        </list-data>
        <template v-slot:footer>
          <btn class="btn-primary btn-block">
            Remove Liquidity
          </btn>
          <btn class="btn-link btn-block">
            Pools
          </btn>
          <list-data class="d-sm-none" style="margin-top: 14px;">
            <list-data-item>
              Exchange rate:
              <template v-slot:value>0.10 TRX = 0.3 BTT</template>
            </list-data-item>
            <list-data-item>
              Current pool size:
              <template v-slot:value>0.5 TRX = 1 BTT</template>
            </list-data-item>
            <list-data-item style="margin-bottom: 0;">
              Your pool share (50%):
              <template v-slot:value>0.2 TRX = 0.2 BTT</template>
            </list-data-item>
          </list-data>
        </template>
      </card-swap>

      <card-swap-final>
        <template v-slot:header>
          Pools
        </template>
        <template v-slot:bodyTop>
          <form-group>
            <transactions-icons :left="walletFirst"></transactions-icons>
          </form-group>
        </template>
        <template v-slot:bodyBottom>
          <form-group>
            <template v-slot:label>
              From address
            </template>
            <div class="text-truncate">
              0xEA3ed91a668B6a56751729016EBafc214dFBeB65
            </div>
          </form-group>

          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                :value="{
                  id: '1',
                  label: 'Ethereum',
                  icon: '/img/icons/ethereum.svg',
                }"
                readonly
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Input
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input
                value="1.1"
                type="number"
                readonly
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  <span class="text-secondary float-right font-weight-normal">
                    Gas: 100 Gwei
                  </span>
                </template>
              </form-input>
            </template>
          </form-group-between-shift-invert>

          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                :value="{
                  id: '1',
                  label: 'Ethereum',
                  icon: '/img/icons/ethereum.svg',
                }"
                readonly
              >
                <template v-slot:label>
                  Input
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input value="1.1" type="number" readonly> </form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </template>

        <br class="d-sm-none" />
        <list-data>
          <list-data-item>
            Exchange rate:
            <template v-slot:value>0.10 TRX = 0.3 BTT</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>0.5 TRX = 1 BTT</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>0.2 TRX = 0.2 BTT</template>
          </list-data-item>
        </list-data>

        <template v-slot:footer>
          <div style="display: flex; justify-content: center;">
            <form-group>
              <checkbox name="terms-of-service" checked>
                Terms of Service
              </checkbox>
            </form-group>
          </div>
          <btn class="btn-success btn-block">
            Add Liquidity
          </btn>
          <btn class="btn-link btn-block">
            Back
          </btn>
        </template>
      </card-swap-final>

      <card-swap-final>
        <template v-slot:header>
          Pools
        </template>
        <template v-slot:bodyTop>
          <form-group>
            <transactions-icons :left="walletFirst"></transactions-icons>
          </form-group>
        </template>
        <template v-slot:bodyBottom>
          <form-group>
            <template v-slot:label>
              From address
            </template>
            <div class="text-truncate">
              0xEA3ed91a668B6a56751729016EBafc214dFBeB65
            </div>
          </form-group>

          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                :value="{
                  id: '1',
                  label: 'Ethereum',
                  icon: '/img/icons/ethereum.svg',
                }"
                readonly
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  Send
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input
                value="1.1"
                type="number"
                readonly
                style="margin-bottom: 14px;"
              >
                <template v-slot:label>
                  <span class="text-secondary float-right font-weight-normal">
                    Gas: 100 Gwei
                  </span>
                </template>
              </form-input>
            </template>
          </form-group-between-shift-invert>

          <form-group-between-shift-invert>
            <template v-slot:left>
              <search-select
                :value="{
                  id: '1',
                  label: 'Ethereum',
                  icon: '/img/icons/ethereum.svg',
                }"
                readonly
              >
                <template v-slot:label>
                  Receive
                </template>
              </search-select>
            </template>
            <template v-slot:right>
              <form-input-without-label>
                <form-input value="1.1" type="number" readonly> </form-input>
              </form-input-without-label>
            </template>
          </form-group-between-shift-invert>
        </template>

        <br class="d-sm-none" />
        <list-data>
          <list-data-item>
            Exchange rate:
            <template v-slot:value>0.10 TRX = 0.3 BTT</template>
          </list-data-item>
          <list-data-item>
            Current pool size:
            <template v-slot:value>0.5 TRX = 1 BTT</template>
          </list-data-item>
          <list-data-item>
            Your pool share (50%):
            <template v-slot:value>0.2 TRX = 0.2 BTT</template>
          </list-data-item>
        </list-data>

        <template v-slot:footer>
          <div style="display: flex; justify-content: center;">
            <form-group>
              <checkbox name="terms-of-service" checked>
                Terms of Service
              </checkbox>
            </form-group>
          </div>
          <btn class="btn-primary btn-block">
            Remove Liquidity
          </btn>
          <btn class="btn-link btn-block">
            Back
          </btn>
        </template>
      </card-swap-final>
    </div>
    <div>
      <checkbox v-model="isGravityTheme" name="is-gravity-theme">
        Gravity Theme
      </checkbox>
      <btn class="btn-primary" @click="$modal.push('logs-intrachain')">
        Logs Intrachain
      </btn>
      <btn class="btn-primary" @click="$modal.push('logs-pools')">
        Logs Pools
      </btn>
      <client-only>
        <modal name="logs-intrachain">
          <modal-content :show-footer="false" size="md">
            <template v-slot:head>
              Logs
            </template>
            <template v-slot:body>
              <table-log-intrachain></table-log-intrachain>
              <pagination v-model="page" count-pages="10"></pagination>
              <div class="text-center">
                <btn class="btn-link">
                  Back
                </btn>
              </div>
            </template>
          </modal-content>
        </modal>
        <modal name="logs-pools">
          <modal-content :show-footer="false" size="md">
            <template v-slot:head>
              Pools
            </template>
            <template v-slot:body>
              <table-log-pools></table-log-pools>
              <pagination v-model="page" count-pages="10"></pagination>
              <div class="text-center">
                <btn class="btn-link">
                  Back
                </btn>
              </div>
            </template>
          </modal-content>
        </modal>
      </client-only>
    </div>
  </div>
</template>

<script>
import Tabs from '~/components/Tabs'
import Btn from '~/components/Btn'
import FormInput from '~/components/FormInput'
import CardSwap from '~/components/CardSwap'
import SimpleWrapperSlimSm from '~/components/SimpleWrapperSlimSm'
import FormGroupBetweenShiftInvert from '~/components/FormGroupBetweenShiftInvert'
import FormGroupBetweenShiftInvert1 from '~/components/FormGroupBetweenShiftInvert1'
import SearchSelect from '~/components/SearchSelect'
import ListData from '~/components/ListData'
import ListDataItem from '~/components/ListDataItem'
import FormInputWithoutLabel from '~/components/FormInputWithoutLabel'
import FormGroupBetweenShift1 from '~/components/FormGroupBetweenShift1'
import CardSwapFinal from '~/components/CardSwapFinal'
import FormGroup from '~/components/FormGroup'
import Checkbox from '~/components/Checkbox'
import TransactionsIcons from '~/components/TransactionsIcons'
import ModalContent from '~/components/ModalContent'
import TableLogIntrachain from '~/components/TableLogIntrachain'
import TableLogPools from '~/components/TableLogPools'
import Pagination from '~/components/Pagination'
import Icon from '~/components/Icon'

const defaultTab = 'swap'

export default {
  components: {
    Icon,
    Btn,
    FormInput,
    CardSwap,
    SimpleWrapperSlimSm,
    FormGroupBetweenShiftInvert,
    FormGroupBetweenShiftInvert1,
    SearchSelect,
    Tabs,
    ListData,
    ListDataItem,
    FormInputWithoutLabel,
    FormGroupBetweenShift1,
    CardSwapFinal,
    FormGroup,
    Checkbox,
    TransactionsIcons,
    ModalContent,
    TableLogIntrachain,
    TableLogPools,
    Pagination,
    CaretIcon: () => import('assets/icons/caret.svg?inline'),
  },
  data: () => ({
    isGravityTheme: false,
    defaultTab,
    tab: defaultTab,
    page: 1,
    wallets: [],
    walletFirst: {
      id: '1-0',
      label: 'TRON',
      icon: '/img/icons/tron.svg',
    },
    walletSecond: {
      id: '2-0',
      label: 'Waves',
      icon: '/img/icons/waves.svg',
    },
    walletThree: undefined,
  }),
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
  },
  watch: {
    isGravityTheme(isGravityTheme) {
      // eslint-disable-next-line no-console
      console.log(isGravityTheme, isGravityTheme ? 'gravity' : 'susy')
      this.$store.dispatch('theme/setTheme', {
        theme: isGravityTheme ? 'gravity' : 'susy',
      })
    },
    $route(to) {
      // @ts-ignore
      this.tab = to.query.tab || defaultTab
    },
  },
  created() {
    // @ts-ignore
    this.tab = this.$route.query.tab || defaultTab
  },
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', false)
    const wallets = [
      {
        id: '1',
        label: 'Ethereum',
        icon: '/img/icons/ethereum.svg',
      },
      {
        id: '2',
        label: 'Waves',
        icon: '/img/icons/waves.svg',
      },
      {
        id: '3',
        label: 'NEO',
        icon: '/img/icons/neo.svg',
      },
      {
        id: '4',
        label: 'Tron',
        icon: '/img/icons/tron.svg',
      },
    ]
    for (let i = 0; i < 20; i++) {
      wallets.forEach((wallet) => {
        const newWallet = { ...wallet }
        newWallet.id = newWallet.id + '-' + String(i)
        // @ts-ignore
        this.wallets.push(newWallet)
      })
    }
  },
  methods: {
    getTabLink(tab) {
      const link = { name: this.$route.name }
      if (tab) {
        // @ts-ignore
        link.query = { tab }
      }
      return link
    },
  },
}
</script>

<style></style>
