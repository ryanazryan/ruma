'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { logoutUser } from '@/lib/api'

type AccountTab =
  | 'profile'
  | 'addresses'

interface AccountProfile {
  fullName: string
  email: string
  joinDate: string
  profilePhotoUrl?: string | null
}

interface CustomerAddress {
  id: string
  label: string
  recipientName: string
  phone: string
  addressLine: string
  district: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

interface AccountPageProps {
  profile?: AccountProfile
  initialAddresses?: CustomerAddress[]
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: CustomerAddress
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
}) {
  return (
    <div
      className={[
        'rounded-sm border p-4',
        address.isDefault
          ? 'border-brand bg-brand-tint'
          : 'border-line bg-white',
      ].join(' ')}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-ink">
            {address.label ||
              address.recipientName}
          </p>

          {address.isDefault && (
            <span className="rounded bg-brand-subtle px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand">
              Default
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:text-ink"
            aria-label="Edit address"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded text-ink-muted transition-colors hover:text-error"
            aria-label="Delete address"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>

      <address className="not-italic text-sm leading-relaxed text-ink-sub">
        <p>{address.recipientName}</p>
        <p>{address.addressLine}</p>
        <p>{address.district}</p>
        <p>
          {address.city}, {address.province}
        </p>
        <p>{address.postalCode}</p>

        {address.phone && (
          <p className="mt-1 text-xs text-ink-muted">
            {address.phone}
          </p>
        )}
      </address>

      {!address.isDefault && (
        <button
          type="button"
          onClick={onSetDefault}
          className="mt-3 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
        >
          Set as default
        </button>
      )}
    </div>
  )
}

function AddressForm({
  initialAddress,
  profileName,
  onSave,
  onCancel,
}: {
  initialAddress?: CustomerAddress
  profileName: string
  onSave: (address: CustomerAddress) => void
  onCancel: () => void
}) {
  const [form, setForm] =
    useState({
      label:
        initialAddress?.label ?? 'Home',
      recipientName:
        initialAddress?.recipientName ??
        profileName,
      phone:
        initialAddress?.phone ?? '',
      addressLine:
        initialAddress?.addressLine ?? '',
      district:
        initialAddress?.district ?? '',
      city:
        initialAddress?.city ?? '',
      province:
        initialAddress?.province ?? '',
      postalCode:
        initialAddress?.postalCode ?? '',
    })

  const fields: Array<{
    key: keyof typeof form
    label: string
    placeholder: string
    required?: boolean
  }> = [
    {
      key: 'label',
      label: 'Address label',
      placeholder:
        'Home, Office, etc.',
      required: true,
    },
    {
      key: 'recipientName',
      label: 'Recipient name',
      placeholder: 'Full name',
      required: true,
    },
    {
      key: 'phone',
      label: 'Phone number',
      placeholder: '08xxxxxxxxxx',
      required: true,
    },
    {
      key: 'addressLine',
      label: 'Address',
      placeholder:
        'Street, house number, apartment, etc.',
      required: true,
    },
    {
      key: 'district',
      label: 'District',
      placeholder: 'District',
      required: true,
    },
    {
      key: 'city',
      label: 'City',
      placeholder: 'City',
      required: true,
    },
    {
      key: 'province',
      label: 'Province',
      placeholder: 'Province',
      required: true,
    },
    {
      key: 'postalCode',
      label: 'Postal code',
      placeholder: 'Postal code',
      required: true,
    },
  ]

  return (
    <div className="space-y-4 rounded-sm border border-line bg-canvas p-5">
      <p className="text-sm font-semibold text-ink">
        {initialAddress
          ? 'Edit address'
          : 'Add new address'}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className={
              field.key ===
              'addressLine'
                ? 'sm:col-span-2'
                : undefined
            }
          >
            <label className="mb-1.5 block text-xs font-medium text-ink-sub">
              {field.label}
              {field.required && (
                <span className="ml-0.5 text-error">
                  *
                </span>
              )}
            </label>

            <input
              type="text"
              value={form[field.key]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [field.key]:
                    event.target.value,
                }))
              }
              placeholder={field.placeholder}
              className="h-9 w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() =>
            onSave({
              id:
                initialAddress?.id ??
                crypto.randomUUID(),
              label: form.label,
              recipientName:
                form.recipientName,
              phone: form.phone,
              addressLine:
                form.addressLine,
              district: form.district,
              city: form.city,
              province: form.province,
              postalCode:
                form.postalCode,
              isDefault:
                initialAddress?.isDefault ??
                false,
            })
          }
          className="h-9 rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Save address
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-md border border-line px-5 text-sm font-medium text-ink-sub transition-colors hover:border-line-strong hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export function AccountPage({
  profile,
  initialAddresses = [],
}: AccountPageProps) {
  const router = useRouter()

  const [tab, setTab] =
    useState<AccountTab>('profile')

  const [profileName, setProfileName] =
    useState(
      profile?.fullName ?? 'Customer',
    )

  const [profileEmail, setProfileEmail] =
    useState(
      profile?.email ?? '—',
    )

  const [isEditingProfile, setIsEditingProfile] =
    useState(false)

  const [profileSaved, setProfileSaved] =
    useState(false)

  const [addresses, setAddresses] =
    useState<CustomerAddress[]>(
      initialAddresses,
    )

  const [editingAddressId, setEditingAddressId] =
    useState<string | null>(null)

  const [isAddingAddress, setIsAddingAddress] =
    useState(false)

  const [isLoggingOut, setIsLoggingOut] =
    useState(false)

  const [logoutError, setLogoutError] =
    useState<string | null>(null)

  const initials =
    profileName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((name) =>
        name[0]?.toUpperCase(),
      )
      .join('') || 'C'

  function handleSaveProfile() {
    setIsEditingProfile(false)
    setProfileSaved(true)

    window.setTimeout(() => {
      setProfileSaved(false)
    }, 2500)
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    setLogoutError(null)

    try {
      await logoutUser()
      router.replace('/login')
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : 'Unable to log out.',
      )
      setIsLoggingOut(false)
    }
  }

  function handleDeleteAddress(id: string) {
    setAddresses((current) =>
      current.filter(
        (address) =>
          address.id !== id,
      ),
    )
  }

  function handleSetDefault(id: string) {
    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault:
          address.id === id,
      })),
    )
  }

  function handleSaveAddress(
    address: CustomerAddress,
  ) {
    setAddresses((current) => {
      const exists = current.some(
        (item) => item.id === address.id,
      )

      if (exists) {
        return current.map((item) =>
          item.id === address.id
            ? address
            : item,
        )
      }

      return [...current, address]
    })

    setEditingAddressId(null)
    setIsAddingAddress(false)
  }

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* Account header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-lg font-semibold text-cream">
            {profile?.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profileName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div>
            <h1 className="text-lg font-semibold text-ink">
              {profileName}
            </h1>

            <p className="text-sm text-ink-muted">
              Member since{' '}
              {profile?.joinDate ?? '—'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex border-b border-line">
          <button
            type="button"
            onClick={() =>
              setTab('profile')
            }
            className={[
              '-mb-px border-b-2 px-5 py-2.5 text-sm font-medium transition-colors',
              tab === 'profile'
                ? 'border-brand text-brand'
                : 'border-transparent text-ink-muted hover:text-ink',
            ].join(' ')}
          >
            Profile
          </button>

          <button
            type="button"
            onClick={() =>
              setTab('addresses')
            }
            className={[
              '-mb-px border-b-2 px-5 py-2.5 text-sm font-medium transition-colors',
              tab === 'addresses'
                ? 'border-brand text-brand'
                : 'border-transparent text-ink-muted hover:text-ink',
            ].join(' ')}
          >
            Addresses
          </button>

          <button
            type="button"
            onClick={() =>
              router.push('/wishlist')
            }
            className="border-b-2 border-transparent px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Wishlist
          </button>
        </div>

        {/* Profile */}
        {tab === 'profile' && (
          <div className="space-y-6">

            {profileSaved && (
              <div className="flex items-center gap-2.5 rounded-md border border-brand-subtle bg-brand-tint px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>

                <p className="text-sm font-medium text-brand">
                  Profile updated successfully.
                </p>
              </div>
            )}

            <section className="rounded-sm border border-line bg-white p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-ink">
                    Personal information
                  </h2>

                  <p className="mt-0.5 text-xs text-ink-muted">
                    Manage your name and email address.
                  </p>
                </div>

                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditingProfile(true)
                    }
                    className="flex items-center gap-1.5 text-xs font-medium text-brand transition-colors hover:text-brand-dark"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-sub">
                      Full name
                    </label>

                    <input
                      type="text"
                      value={profileName}
                      onChange={(event) =>
                        setProfileName(
                          event.target.value,
                        )
                      }
                      className="h-9 w-full rounded-md border border-line px-3 text-sm text-ink focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-sub">
                      Email address
                    </label>

                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(event) =>
                        setProfileEmail(
                          event.target.value,
                        )
                      }
                      className="h-9 w-full rounded-md border border-line px-3 text-sm text-ink focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={
                        handleSaveProfile
                      }
                      className="h-9 rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                    >
                      Save changes
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsEditingProfile(false)
                      }
                      className="h-9 rounded-md border border-line px-5 text-sm font-medium text-ink-sub transition-colors hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="space-y-4">
                  <div className="flex gap-6">
                    <dt className="mt-0.5 w-32 shrink-0 text-xs text-ink-muted">
                      Full name
                    </dt>

                    <dd className="text-sm text-ink">
                      {profileName}
                    </dd>
                  </div>

                  <div className="flex gap-6">
                    <dt className="mt-0.5 w-32 shrink-0 text-xs text-ink-muted">
                      Email address
                    </dt>

                    <dd className="text-sm text-ink">
                      {profileEmail}
                    </dd>
                  </div>

                  <div className="flex gap-6">
                    <dt className="mt-0.5 w-32 shrink-0 text-xs text-ink-muted">
                      Member since
                    </dt>

                    <dd className="text-sm text-ink">
                      {profile?.joinDate ?? '—'}
                    </dd>
                  </div>
                </dl>
              )}
            </section>

            {/* Security */}
            <section className="rounded-sm border border-line bg-white p-6">
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  Password & security
                </h2>

                <p className="mt-0.5 text-xs text-ink-muted">
                  Update your password or manage active sessions.
                </p>
              </div>

              <div className="mt-4 space-y-3">

                {/* Change password */}
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      'change-password',
                    )
                  }
                  className="group flex w-full items-center justify-between border-t border-line py-3 text-sm text-ink transition-colors hover:text-brand"
                >
                  <span>
                    Change password
                  </span>

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ink-faint transition-colors group-hover:text-brand"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="group flex w-full items-center justify-between border-t border-line py-3 text-sm text-ink-muted transition-colors hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {isLoggingOut
                      ? 'Signing out…'
                      : 'Log out'}
                  </span>

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ink-faint transition-colors group-hover:text-error"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {logoutError && (
                  <p className="pt-1 text-xs text-error">
                    {logoutError}
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Addresses */}
        {tab === 'addresses' && (
          <div className="space-y-4">
            {addresses.length === 0 &&
            !isAddingAddress ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-canvas">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ink-faint"
                  >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="3"
                    />
                  </svg>
                </div>

                <p className="mb-1 text-sm font-medium text-ink">
                  No addresses saved
                </p>

                <p className="mb-5 text-xs text-ink-muted">
                  Add a delivery address to speed up checkout.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setIsAddingAddress(true)
                  }
                  className="h-9 rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                >
                  Add first address
                </button>
              </div>
            ) : (
              <>
                {addresses.map((address) =>
                  editingAddressId ===
                  address.id ? (
                    <AddressForm
                      key={address.id}
                      initialAddress={address}
                      profileName={
                        profileName
                      }
                      onSave={
                        handleSaveAddress
                      }
                      onCancel={() =>
                        setEditingAddressId(
                          null,
                        )
                      }
                    />
                  ) : (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={() =>
                        setEditingAddressId(
                          address.id,
                        )
                      }
                      onDelete={() =>
                        handleDeleteAddress(
                          address.id,
                        )
                      }
                      onSetDefault={() =>
                        handleSetDefault(
                          address.id,
                        )
                      }
                    />
                  ),
                )}

                {isAddingAddress ? (
                  <AddressForm
                    profileName={profileName}
                    onSave={
                      handleSaveAddress
                    }
                    onCancel={() =>
                      setIsAddingAddress(false)
                    }
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setIsAddingAddress(true)
                    }
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-sm border border-dashed border-line px-4 text-sm font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line
                        x1="12"
                        y1="5"
                        x2="12"
                        y2="19"
                      />
                      <line
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                      />
                    </svg>

                    Add new address
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}