import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../../css/Profile.module.css';
import ProfileCard from './ProfileCard';
import ProfileDetails from './ProfileDetails';

export default function Profile() {
  const { user } = useAuth();
  const { t, locale } = useLanguage();

  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchProfile = async () => {
    try {
      const [profileRes, catRes] = await Promise.all([
        api.get('/api/artist-profile'),
        api.get('/api/categories'),
      ]);
      setArtistData(profileRes.data);
      setCategories(catRes.data);
    } catch (e) {
      console.error("Erreur profil", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'artiste') fetchProfile();
  }, [user, locale]);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  if (user?.role !== 'artiste') {
    return <div className="container mt-5 pt-5">{t('auth.restricted_access')}</div>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner-border" style={{ color: '#c5a059', width: 48, height: 48 }} />
      </div>
    );
  }

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.container}>

        {successMsg && (
          <div className={styles.flash}>{successMsg}</div>
        )}

        <div className="row g-4">
          <div className="col-md-4">
            <ProfileCard
              artistData={artistData}
              setArtistData={setArtistData}
              flash={flash}
              locale={locale}
              styles={styles}
            />
          </div>
          <div className="col-md-8">
            <ProfileDetails
              artistData={artistData}
              categories={categories}
              fetchProfile={fetchProfile}
              flash={flash}
              locale={locale}
              t={t}
              styles={styles}
            />
          </div>
        </div>

      </div>
    </div>
  );
}